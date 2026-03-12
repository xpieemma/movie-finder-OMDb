import { cacheService } from '../config/cache.js';

export const generateSearchKey = (title: string, page: number, type?: string, year?: string): string => {
  return `search:${title.toLowerCase().trim()}:${page}:${type || 'all'}:${year || 'all'}`;
};

export const generateMovieKey = (id: string, plot: string): string => {
  return `movie:${id}:${plot}`;
};

export const clearMovieCache = async (id?: string) => {
  // This would need access to all cache keys - simplified version
  if (id) {
    await cacheService.delete(`movie:${id}:short`);
    await cacheService.delete(`movie:${id}:full`);
  }
};
