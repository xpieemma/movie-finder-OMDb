import axios, { AxiosInstance, AxiosError } from "axios";
import Logger from "../config/logger.js";
import { config } from "../config/env.js";
import { cacheService } from "../config/cache.js";
import { OMDB, ERROR_MESSAGES } from "../config/constants.js";
import {
  OMDbSearchResponse,
  OMDbMovieDetails,
  FormattedMovie,
  FormattedMovieDetails,
  SearchParams,
} from "../types/movie.types.js";

/**
 * OMDb API service with caching and error handling
 */
class OMDbService {
  private client: AxiosInstance;
  private requestCount: number = 0;
  private lastResetTime: Date = new Date();

  constructor() {
    this.client = axios.create({
      baseURL: config.omdb.baseUrl,
      timeout: config.omdb.timeout,
      params: {
        apikey: config.omdb.apiKey,
      },
    });

    this.setupInterceptors();
    this.startRateLimitMonitor();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        this.requestCount++;
        Logger.debug(`OMDb API Request #${this.requestCount}: ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        Logger.error("OMDb API error:", error.message);

        if (error.code === "ECONNABORTED") {
          throw new Error(ERROR_MESSAGES.TIMEOUT);
        }
        if (!error.response) {
          throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }
        if (error.response.status === 401) {
          throw new Error("Invalid OMDb API key");
        }
        if (error.response.status === 429) {
          throw new Error(ERROR_MESSAGES.RATE_LIMIT);
        }

        return Promise.reject(error);
      },
    );
  }

  private startRateLimitMonitor(): void {
    // Reset counter daily
    setInterval(
      () => {
        this.requestCount = 0;
        this.lastResetTime = new Date();
        Logger.info("OMDb API request counter reset");
      },
      24 * 60 * 60 * 1000,
    );
  }

  /**
   * Check if we're approaching OMDb rate limit
   */
  private checkRateLimit(): void {
    if (this.requestCount >= OMDB.RATE_LIMIT * 0.9) {
      Logger.warn(
        `⚠️ Approaching OMDb API limit: ${this.requestCount}/${OMDB.RATE_LIMIT}`,
      );
    }
  }

  /**
   * Search movies with caching
   */
  async searchMovies(params: SearchParams): Promise<any> {
    const { title, page = 1, type, year } = params;
    if (!title) {
      throw new Error("A title is required to search movies.");
    }
    // Check cache first
    const cacheKey = cacheService.getSearchKey(title, page, type, year);
    const cached = cacheService.get(cacheKey);

    if (cached) {
      Logger.debug(`Returning cached search results for: ${title}`);
      return cached;
    }

    this.checkRateLimit();

    const apiParams: any = {
      s: title,
      page: Math.min(page, 100),
    };

    if (type) apiParams.type = type;
    if (year) apiParams.y = year;

    try {
      const response = await this.client.get<OMDbSearchResponse>("", {
        params: apiParams,
      });

      if (response.data.Response === "False") {
        return {
          success: false,
          error: response.data.Error || "No results found",
          results: [],
          totalResults: 0,
        };
      }

      const result = {
        success: true,
        totalResults: parseInt(response.data.totalResults || "0"),
        page,
        results: this.formatSearchResults(response.data.Search || []),
        query: { title, type, year },
      };

      // Cache successful responses
      cacheService.set(cacheKey, result, 300); // 5 minutes TTL

      return result;
    } catch (error) {
      Logger.error("Search failed:", error);
      throw error;
    }
  }

  /**
   * Get movie details with caching
   */
  async getMovieDetails(
    id: string,
    plot: "short" | "full" = "full",
  ): Promise<any> {
    // Check cache first
    const cacheKey = cacheService.getMovieKey(id, plot);
    const cached = cacheService.get(cacheKey);

    if (cached) {
      Logger.debug(`Returning cached movie details for: ${id}`);
      return cached;
    }

    this.checkRateLimit();

    try {
      const response = await this.client.get<OMDbMovieDetails>("", {
        params: {
          i: id,
          plot,
        },
      });

      if (response.data.Response === "False") {
        return {
          success: false,
          error: response.data.Error || "Movie not found",
        };
      }

      const result = {
        success: true,
        movie: this.formatMovieDetails(response.data),
      };

      // Cache successful responses (longer TTL for details)
      cacheService.set(cacheKey, result, 600); // 10 minutes TTL

      return result;
    } catch (error) {
      Logger.error("Failed to fetch movie details:", error);
      throw error;
    }
  }

  /**
   * Format search results
   */
  private formatSearchResults(movies: any[]): FormattedMovie[] {
    if (!movies || !Array.isArray(movies)) return [];

    return movies.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster !== "N/A" ? movie.Poster : null,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
    }));
  }

  /**
   * Format movie details
   */
  private formatMovieDetails(movie: OMDbMovieDetails): FormattedMovieDetails {
    return {
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster !== "N/A" ? movie.Poster : null,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
      rated: movie.Rated !== "N/A" ? movie.Rated : null,
      released: movie.Released !== "N/A" ? movie.Released : null,
      runtime: movie.Runtime !== "N/A" ? movie.Runtime : null,
      genres: movie.Genre !== "N/A" ? movie.Genre.split(", ") : [],
      director: movie.Director !== "N/A" ? movie.Director : null,
      writers: movie.Writer !== "N/A" ? movie.Writer.split(", ") : [],
      actors: movie.Actors !== "N/A" ? movie.Actors.split(", ") : [],
      plot: movie.Plot !== "N/A" ? movie.Plot : null,
      language: movie.Language !== "N/A" ? movie.Language.split(", ") : [],
      country: movie.Country !== "N/A" ? movie.Country.split(", ") : [],
      awards: movie.Awards !== "N/A" ? movie.Awards : null,
      ratings: movie.Ratings || [],
      metascore:
        movie.Metascore && movie.Metascore !== "N/A"
          ? parseInt(movie.Metascore)
          : null,
      imdbRating:
        movie.imdbRating && movie.imdbRating !== "N/A"
          ? parseFloat(movie.imdbRating)
          : null,
      imdbVotes:
        movie.imdbVotes && movie.imdbVotes !== "N/A"
          ? movie.imdbVotes.replace(/,/g, "")
          : null,
      boxOffice:
        movie.BoxOffice && movie.BoxOffice !== "N/A" ? movie.BoxOffice : null,
      production:
        movie.Production && movie.Production !== "N/A"
          ? movie.Production
          : null,
      website: movie.Website && movie.Website !== "N/A" ? movie.Website : null,
    };
  }

  /**
   * Get API usage statistics
   */
  getStats() {
    return {
      requestCount: this.requestCount,
      remaining: OMDB.RATE_LIMIT - this.requestCount,
      resetTime: new Date(this.lastResetTime.getTime() + 24 * 60 * 60 * 1000),
      cache: cacheService.getStats(),
    };
  }
}

export const omdbService = new OMDbService();
