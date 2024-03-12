import Movie from '../model/movieModel.js';
import Review from '../model/reviewModel.js';

export const createReview = async (req, res) => {
    try {
        const { movieId, reviewerName, rating, comments } = req.body;
        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });

        const review = new Review({ movie: movieId, reviewerName, rating, comments });
        await review.save();

        movie.reviews.push(review._id);
        await movie.save();

        const updatedMovie = await Movie.findById(movieId).populate('reviews');
        const averageRating = updatedMovie.reviews.reduce((sum, review) => sum + review.rating, 0) / updatedMovie.reviews.length;
        updatedMovie.averageRating = averageRating;
        await updatedMovie.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().populate('movie');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getReviewsById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('movie');
        if (!review) return res.status(404).json({ error: 'Review not found' });
        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { reviewerName, rating, comments } = req.body;
        const review = await Review.findByIdAndUpdate(req.params.id, { reviewerName, rating, comments }, { new: true }).populate('movie');
        if (!review) return res.status(404).json({ error: 'Review not found' });

        const movie = await Movie.findById(review.movie._id).populate('reviews');
        const averageRating = movie.reviews.reduce((sum, review) => {
            return sum + review.rating;
        }, 0) / movie.reviews.length;
        movie.averageRating = averageRating;
        await movie.save();

        res.json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ error: 'Review not found' });

        const movie = await Movie.findById(review.movie);
        movie.reviews = movie.reviews.filter(reviewId => reviewId.toString() !== req.params.id);
        const reviewDocs = await Promise.all(movie.reviews.map(async reviewId => {
            return await Review.findById(reviewId);
        }));
        const validReviewDocs = reviewDocs.filter(reviewDoc => reviewDoc !== null);
        const averageRating = validReviewDocs.length > 0 ?
            (validReviewDocs.reduce((sum, reviewDoc) => sum + reviewDoc.rating, 0) / validReviewDocs.length).toFixed(1) : 0;

        movie.averageRating = averageRating;
        await movie.save();

        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
