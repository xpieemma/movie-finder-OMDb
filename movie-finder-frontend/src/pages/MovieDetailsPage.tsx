import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { movieApi } from '../api/movieApi';
import { MovieDetails } from '../types';

const MovieDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const response = await movieApi.getMovieDetails(id);

       // Check if the response indicates success and contains a movie
  if (response.success && response.movie) {
    setMovie(response.movie);
  } else {
  
    setError(response.error || 'Movie not found');
  }
      } catch (err: any) {
        let errorMessage = 'Failed to fetch movie details';
        if (err.response?.data?.error) {
       errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="text-center text-red-600 dark:text-red-400 p-8">
        <p className="text-6xl mb-4">🎥🎥🎥</p>
        <p className="text-xl">{error || 'Movie not found'}</p>
        <Link to="/search" className="inline-block mt-4 text-primary-600 hover:underline">
          Go back to search
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid md:grid-cols-3 gap-8">
        {/* Poster */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-1"
        >
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-dark-300 rounded-lg flex items-center justify-center text-gray-400">
              🎥🎥🎥 No Poster
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="md:col-span-2 space-y-6"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {movie.year} • {movie.runtime}
            </p>
          </div>

          {/* Ratings */}
          <div className="flex gap-4">
            {movie.imdbRating && (
              <div className="bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">IMDb Rating</div>
                <div className="text-2xl font-bold">⭐ {movie.imdbRating}/10</div>
              </div>
            )}
            {movie.metascore && (
              <div className="bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Metascore</div>
                <div className="text-2xl font-bold">{movie.metascore}</div>
              </div>
            )}
          </div>

          {/* Plot */}
          <div className="bg-gray-50 dark:bg-dark-300 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Plot</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{movie.plot}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {movie.genres.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Genres</h3>
                <p className="text-gray-600 dark:text-gray-400">{movie.genres.join(', ')}</p>
              </div>
            )}
            {movie.director && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Director</h3>
                <p className="text-gray-600 dark:text-gray-400">{movie.director}</p>
              </div>
            )}
            {movie.writers.length > 0 && (
              <div className="col-span-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Writers</h3>
                <p className="text-gray-600 dark:text-gray-400">{movie.writers.join(', ')}</p>
              </div>
            )}
            {movie.actors.length > 0 && (
              <div className="col-span-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Cast</h3>
                <p className="text-gray-600 dark:text-gray-400">{movie.actors.join(', ')}</p>
              </div>
            )}
            {movie.awards && (
              <div className="col-span-2">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Awards</h3>
                <p className="text-gray-600 dark:text-gray-400">{movie.awards}</p>
              </div>
            )}
            {movie.boxOffice && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Box Office</h3>
                <p className="text-gray-600 dark:text-gray-400">{movie.boxOffice}</p>
              </div>
            )}
            {movie.production && (
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">Production</h3>
                <p className="text-gray-600 dark:text-gray-400">{movie.production}</p>
              </div>
            )}
          </div>

          {/* Back button */}
          <Link
            to="/search"
            className="inline-block px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
          >
            ← Back to Search
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MovieDetailsPage;
