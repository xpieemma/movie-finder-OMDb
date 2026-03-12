import { cacheService } from '../config/cache';

export const generateSearchKey = (title: string, page: number, type?: string, year?: string): string => {
  return `search:${title.toLowerCase().trim()}:${page}:${type || 'all'}:${year || 'all'}`;
};

export const generateMovieKey = (id: string, plot: string): string => {
  return `movie:${id}:${plot}`;
};

export const clearMovieCache = async (id?: string) => {
  // This would need access to all cache keys - simplified version
  if (id) {
    await cacheService.del(`movie:${id}:short`);
    await cacheService.del(`movie:${id}:full`);
  }
};
