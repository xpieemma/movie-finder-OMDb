export interface OMDbSearchResponse {
  Search?: OMDbMovie[];
  totalResults?: string;
  Response: string;
  Error?: string;
}

export interface OMDbMovie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface OMDbMovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response: string;
  Error?: string;
}

export interface Rating {
  Source: string;
  Value: string;
}

export interface FormattedMovie {
  id: string;
  title: string;
  year: string;
  type: string;
  poster: string | null;
  imdbUrl: string;
}

export interface FormattedMovieDetails extends FormattedMovie {
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
  ratings: Rating[];
  metascore: number | null;
  imdbRating: number | null;
  imdbVotes: string | null;
  boxOffice: string | null;
  production: string | null;
  website: string | null;
}

export interface SearchParams {
  title?: string;
  page?: number;
  type?: string;
  year?: string;
}
