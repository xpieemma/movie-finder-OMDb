import { Router } from 'express';
import { searchMovies, getMovieDetails, getStats } from '../controllers/movie.controller.js';
import { validateSearch, validateMovieId } from '../middleware/validation.js';
import { searchLimiter } from '../middleware/rateLimiter.js';

const router = Router();

/**
 * @route GET /api/search
 * @description Search for movies
 * @access Public
 */
router.get('/search', validateSearch, searchLimiter, searchMovies);

/**
 * @route GET /api/movies/:id
 * @description Get movie details
 * @access Public
 */
router.get('/movies/:id', validateMovieId, getMovieDetails);

/**
 * @route GET /api/stats
 * @description Get API usage statistics
 * @access Public (but protected in production)
 */
router.get('/stats', getStats);

export default router;