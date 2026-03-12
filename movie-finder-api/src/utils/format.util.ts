import { OMDbMovie, OMDbMovieDetails, FormattedMovie, FormattedMovieDetails } from '../types/movie.types.js';

export const formatMovieSearchResult = (movie: OMDbMovie): FormattedMovie => ({
  id: movie.imdbID,
  title: movie.Title,
  year: movie.Year,
  type: movie.Type,
  poster: movie.Poster !== 'N/A' ? movie.Poster : null,
  imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
});

export const formatMovieDetails = (movie: OMDbMovieDetails): FormattedMovieDetails => ({
  id: movie.imdbID,
  title: movie.Title,
  year: movie.Year,
  type: movie.Type,
  poster: movie.Poster !== 'N/A' ? movie.Poster : null,
  imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
  rated: movie.Rated !== 'N/A' ? movie.Rated : null,
  released: movie.Released !== 'N/A' ? movie.Released : null,
  runtime: movie.Runtime !== 'N/A' ? movie.Runtime : null,
  genres: movie.Genre !== 'N/A' ? movie.Genre.split(', ') : [],
  director: movie.Director !== 'N/A' ? movie.Director : null,
  writers: movie.Writer !== 'N/A' ? movie.Writer.split(', ') : [],
  actors: movie.Actors !== 'N/A' ? movie.Actors.split(', ') : [],
  plot: movie.Plot !== 'N/A' ? movie.Plot : null,
  language: movie.Language !== 'N/A' ? movie.Language.split(', ') : [],
  country: movie.Country !== 'N/A' ? movie.Country.split(', ') : [],
  awards: movie.Awards !== 'N/A' ? movie.Awards : null,
  ratings: movie.Ratings || [],
metascore: movie.Metascore && movie.Metascore !== 'N/A' ? parseInt(movie.Metascore) : null,
    imdbRating: movie.imdbRating && movie.imdbRating !== 'N/A' ? parseFloat(movie.imdbRating) : null,
    imdbVotes: movie.imdbVotes && movie.imdbVotes !== 'N/A' ? movie.imdbVotes.replace(/,/g, '') : null,
    boxOffice: movie.BoxOffice && movie.BoxOffice !== 'N/A' ? movie.BoxOffice : null,
    production: movie.Production && movie.Production !== 'N/A' ? movie.Production : null,
    website: movie.Website && movie.Website !== 'N/A' ? movie.Website : null
});
