export const OMDB = {
  BASE_URL: 'http://www.omdbapi.com',
  TIMEOUT: 10000,
  VALID_TYPES: ['movie', 'series', 'episode'] as const,
  YEAR_PATTERN: /^\d{4}$/,
  RATE_LIMIT: 1000, // OMDb free tier limit per day
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_MESSAGES = {
  MISSING_TITLE: 'Title query parameter is required',
  MOVIE_NOT_FOUND: 'Movie not found',
  INVALID_IMDB_ID: 'Invalid IMDb ID format',
  NETWORK_ERROR: 'Network error occurred',
  TIMEOUT: 'Request timeout',
  RATE_LIMIT: 'Too many requests, please try again later',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  OMDB_API_ERROR: 'OMDb API is currently unavailable',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  MAX_PAGE: 100,
  ITEMS_PER_PAGE: 10,
} as const;

export const CACHE = {
  TTL: 600, // 10 minutes
  CHECK_PERIOD: 120, // 2 minutes
  SEARCH_TTL: 300, // 5 minutes for search results
  DETAILS_TTL: 600, // 10 minutes for movie details
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const;

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;