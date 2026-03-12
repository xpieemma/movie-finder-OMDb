import { Request, Response, NextFunction } from 'express';
import Logger from '../config/logger.ts';
import { omdbService } from '../services/omdb.service.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.ts';
import { SearchParams } from '../types/movie.types.ts';

/**
 * Search movies controller
 */
export const searchMovies = async (
  req: Request<{}, {}, {}, SearchParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, page = 1, type, year } = req.query;
    
    Logger.info(`🔍 Searching movies: "${title}"`, {
      requestId: req.id,
      page,
      type,
      year,
    });

    const result = await omdbService.searchMovies({ title, page, type, year });

    if (!result.success) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString(),
        requestId: req.id,
      });
    }

    res.json({
      ...result,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get movie details controller
 */
export const getMovieDetails = async (
  req: Request<{ id: string }, {}, {}, { plot?: 'short' | 'full' }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { plot = 'full' } = req.query;
    
    Logger.info(`🎬 Fetching movie details: ${id}`, {
      requestId: req.id,
      plot,
    });

    const result = await omdbService.getMovieDetails(id, plot);

    if (!result.success) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        error: result.error,
        timestamp: new Date().toISOString(),
        requestId: req.id,
      });
    }

    res.json({
      ...result,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get API stats controller
 */
export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = omdbService.getStats();
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
      requestId: req.id,
    });
  } catch (error) {
    next(error);
  }
};