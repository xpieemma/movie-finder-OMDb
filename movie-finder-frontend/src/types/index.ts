export interface Movie {
  id: string;
  title: string;
  year: string;
  poster: string | null;
  type: string;
  imdbUrl?: string;
}

export interface MovieDetails extends Movie {
  rated: string | null;
  released: string | null;
  runtime: string | null;
  genres: string[];
  director: string | null;
  writers: string[];
  actors: string[];
  plot: string | null;
  language: string[];
  country: string[];
  awards: string | null;
  ratings: Array<{ Source: string; Value: string }>;
  metascore: number | null;
  imdbRating: number | null;
  imdbVotes: string | null;
  boxOffice: string | null;
  production: string | null;
  website: string | null;
}

export interface SearchParams {
  title: string;
  page?: number;
  type?: string;
  year?: string;
}

export interface SearchResponse {
  success: boolean;
  totalResults: number;
  page: number;
  results: Movie[];
  query: {
    title: string;
    type?: string;
    year?: string;
  };
  timestamp?: string;
  requestId?: string;
}

export interface MovieDetailsResponse {
  success: boolean;
  movie: MovieDetails;
  timestamp?: string;
  requestId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
  requestId?: string;
}
