import NodeCache from 'node-cache';
import Logger from './logger.ts';
import { config } from './env.ts';
import { CACHE } from './constants.ts';

/**
 * Environment-aware caching strategy
 * For Koyeb: In-memory cache (persists as long as container runs)
 * For Render: Would need Redis for persistence across restarts
 */
class CacheService {
  private cache: NodeCache;
  private hits: number = 0;
  private misses: number = 0;

  constructor() {
    this.cache = new NodeCache({ 
      stdTTL: CACHE.TTL, 
      checkperiod: CACHE.CHECK_PERIOD,
      useClones: false,
      maxKeys: 1000, // Prevent memory issues
    });

    // Log cache statistics periodically in production
    if (config.server.isProduction) {
      setInterval(() => {
        this.logStats();
      }, 30 * 60 * 1000); // Every 30 minutes
    }

    Logger.info('✅ Cache service initialized');
  }

  /**
   * Get item from cache
   */
  get<T>(key: string): T | undefined {
    const value = this.cache.get<T>(key);
    
    if (value) {
      this.hits++;
      Logger.debug(`Cache HIT for key: ${key}`);
    } else {
      this.misses++;
      Logger.debug(`Cache MISS for key: ${key}`);
    }
    
    return value;
  }

  /**
   * Set item in cache with environment-specific TTL
   */
  set<T>(key: string, value: T, ttl?: number): void {
    // In development, use shorter TTL
    const finalTtl = config.server.isDevelopment 
      ? Math.min(ttl || CACHE.TTL, 60) // 1 minute max in development
      : ttl || CACHE.TTL;
    
    this.cache.set(key, value, finalTtl);
    Logger.debug(`Cache SET for key: ${key} (TTL: ${finalTtl}s)`);
  }

  /**
   * Delete item from cache
   */
  delete(key: string): void {
    this.cache.del(key);
    Logger.debug(`Cache DELETE for key: ${key}`);
  }

  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.flushAll();
    Logger.debug('Cache CLEARED');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      keys: this.cache.keys().length,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 
        ? (this.hits / (this.hits + this.misses) * 100).toFixed(2) + '%'
        : '0%',
      ksize: this.cache.getStats().ksize,
      vsize: this.cache.getStats().vsize,
    };
  }

  /**
   * Log cache statistics
   */
  private logStats(): void {
    const stats = this.getStats();
    Logger.info('📊 Cache Statistics:', stats);
  }

  /**
   * Generate cache key for search
   */
  getSearchKey(title: string, page: number, type?: string, year?: string): string {
    return `search:${title}:${page}:${type || 'all'}:${year || 'all'}`;
  }

  /**
   * Generate cache key for movie details
   */
  getMovieKey(id: string, plot: string): string {
    return `movie:${id}:${plot}`;
  }
}

export const cacheService = new CacheService();