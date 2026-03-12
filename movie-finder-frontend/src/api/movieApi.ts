import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { env } from '../config/env';
import { 
  SearchParams, 
  SearchResponse, 
  MovieDetailsResponse,
  ApiResponse 
} from '../types';

class MovieApi {
  private api: AxiosInstance;
  private requestCount: number = 0;

  constructor() {
    this.api = axios.create({
      baseURL: env.apiUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.setupKeepAlive();
  }

  private setupInterceptors(): void {
    this.api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        this.requestCount++;
        
        config.params = {
          ...config.params,
          _t: Date.now(),
        };

        config.headers['X-Retry-Count'] = '0';
        
        if (env.isDevelopment) {
          console.log(`í³¡ API Request #${this.requestCount}:`, {
            method: config.method,
            url: config.url,
            params: config.params,
          });
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.api.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 60;
          toast.error(`Rate limited. Please try again in ${retryAfter} seconds.`);
          return Promise.reject(error);
        }

        if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout. Please check your connection.');
          return Promise.reject(error);
        }

        if (!error.response) {
          toast.error('Unable to connect to server. Please try again later.');
          return Promise.reject(error);
        }

        const errorMessage = error.response.data?.error || 
                            error.response.data?.message || 
                            `Error ${error.response.status}`;

        if (error.response.status !== 404) {
          toast.error(errorMessage);
        }

        return Promise.reject(error);
      }
    );
  }

  private setupKeepAlive(): void {
    if (env.isProduction) {
      setInterval(async () => {
        try {
          await this.ping();
          console.log('í²“ Keep-alive ping sent');
        } catch (error) {
          console.error('Keep-alive failed:', error);
        }
      }, 10 * 60 * 1000);
    }
  }

  async ping(): Promise<any> {
    return this.api.get('/ping');
  }

  async searchMovies(params: SearchParams, retryCount = 2): Promise<SearchResponse> {
    try {
      return await this.api.get('/search', { params });
    } catch (error: any) {
      if (retryCount > 0 && error.response?.status >= 500) {
        console.log(`Retrying search, ${retryCount} attempts left`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.searchMovies(params, retryCount - 1);
      }
      throw error;
    }
  }

  async getMovieDetails(id: string, plot: 'short' | 'full' = 'full'): Promise<MovieDetailsResponse> {
    return this.api.get(`/movies/${id}`, { params: { plot } });
  }

  async getHealth(): Promise<ApiResponse<{ status: string }>> {
    return this.api.get('/health');
  }

  async getStats(): Promise<any> {
    return this.api.get('/stats');
  }
}

export const movieApi = new MovieApi();
