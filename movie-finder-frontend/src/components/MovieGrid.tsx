import React from 'react';
import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import { Movie } from '../types';
import LogoEmoji from './LogoEmoji';

interface MovieGridProps {
  movies: Movie[];
  isLoading: boolean;
  error: string | null;
  emptyMessage: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies, isLoading, error, emptyMessage }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600 dark:text-red-400 p-8 bg-red-50 dark:bg-red-900/20 rounded-lg"
      >
        <p className="text-lg mb-2">❌ Error</p>
        <p>{error}</p>
      </motion.div>
    );
  }

  if (movies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-500 dark:text-gray-400 p-8"
      >
        <div className="text-6xl mb-4">
    <span> <div className="inline-flex justify-center w-full -space-x-4">
      <LogoEmoji size="2em" />
      <LogoEmoji size="2em" />
      <LogoEmoji size="2em" />
    </div>
  </span>
        </div>
        <p className="text-lg">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {movies.map((movie, index) => (
        <MovieCard key={movie.id} movie={movie} index={index} />
      ))}
    </div>
  );
};

export default MovieGrid;
