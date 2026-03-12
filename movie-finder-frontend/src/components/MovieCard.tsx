import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  index: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-dark-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all"
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="aspect-[2/3] bg-gray-200 dark:bg-dark-300">
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              📽️📽️📽️ No Poster
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{movie.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{movie.year}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
