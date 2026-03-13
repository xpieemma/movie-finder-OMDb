import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import { movieApi } from '../api/movieApi';
import { useDebounce } from '../hooks/useDebounce';
import { Movie } from '../types';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('title') || '';
  const initialPage = parseInt(searchParams.get('page') || '1');

  const [query, setQuery] = useState<string>(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalResults: 0,
  });

  const debouncedQuery = useDebounce(query, 500);

  const performSearch = useCallback(async (searchQuery: string, page: number = 1) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      setPagination(prev => ({ ...prev, totalPages: 1, totalResults: 0 }));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsRateLimited(false);
      
      const params = { title: searchQuery, page };
      const response = await movieApi.searchMovies(params);
      
      setMovies(response.results || []);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(response.totalResults / 10) || 1,
        totalResults: response.totalResults || 0,
      });
      
      setSearchParams({ 
        title: searchQuery, 
        page: page.toString(),
      }, { replace: true });
      
    } catch (err: any) {
      let errorMessage = 'Failed to search movies'
      if (err.response?.status === 429) {
        setIsRateLimited(true);
        errorMessage = 'Rate limit exceeded. Please wait a moment before searching again.';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) { 
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      //   {
      //   setError(err.message || 'Failed to search movies');
      // }
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialPage);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery && debouncedQuery !== initialQuery && !isRateLimited) {
      performSearch(debouncedQuery, 1);
    }
  }, [debouncedQuery, performSearch, initialQuery, isRateLimited]);

  const handleSearch = (newQuery: string) => {
    if (isRateLimited) {
      toast.error('Please wait before searching again');
      return;
    }
    setQuery(newQuery);
  };

  const handlePageChange = (newPage: number) => {
    if (isRateLimited) {
      toast.error('Rate limited. Please wait.');
      return;
    }
    performSearch(query, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Search Movies</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Find detailed information about any movie
        </p>
      </motion.div>

      <SearchBar 
        onSearch={handleSearch} 
        initialValue={query}
        isLoading={isLoading || isRateLimited}
      />

      {isRateLimited && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-400 text-yellow-700 dark:text-yellow-300 px-4 py-3 rounded-lg text-center"
        >
          ⏳ Rate limit reached. Please wait a moment before searching again.
        </motion.div>
      )}

      {query && !isLoading && !isRateLimited && movies.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 dark:text-gray-400"
        >
          Found {pagination.totalResults} results for "{query}"
          {pagination.totalPages > 1 && ` (Page ${pagination.currentPage} of ${pagination.totalPages})`}
        </motion.div>
      )}

      <MovieGrid 
        movies={movies} 
        isLoading={isLoading} 
        error={error}
        emptyMessage={query ? `No movies found for "${query}"` : 'Enter a search term to find movies'}
      />

      {pagination.totalPages > 1 && !isRateLimited && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchPage;
