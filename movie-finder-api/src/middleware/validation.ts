import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../config/constants.js';

export const validateSearch = (req: Request, res: Response, next: NextFunction) => {
  const { title } = req.query;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Title query parameter is required and must be a non-empty string',
      timestamp: new Date().toISOString(),
    });
  }
  
  if (title.length > 100) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Title must be less than 100 characters',
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
};

export const validateMovieId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Movie ID is required',
      timestamp: new Date().toISOString(),
    });
  }
  
  const imdbIdRegex = /^tt\d+$/;
  if (!imdbIdRegex.test(id)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      error: 'Invalid IMDb ID format. Expected format: tt1234567',
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
};
