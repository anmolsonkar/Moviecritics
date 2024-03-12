import express from 'express';
import { createMovie, getMovies, getMoviesById, updateMovie, deleteMovie, searchMoviesAndReview } from '../controllers/movieController.js';
import { createReview, getReviews, getReviewsById, updateReview, deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

// Movie routes
router.post('/movies', createMovie);
router.get('/movies', getMovies);
router.get('/movies/:id', getMoviesById);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

// Review routes
router.post('/reviews', createReview);
router.get('/reviews', getReviews);
router.get('/reviews/:id', getReviewsById);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

// Search movies and reviews route
router.get('/search', searchMoviesAndReview);

export default router;
