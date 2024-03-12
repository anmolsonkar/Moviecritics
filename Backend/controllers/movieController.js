import Movie from '../model/movieModel.js';
import Review from '../model/reviewModel.js';

export const createMovie = async (req, res) => {
    try {

        const { name, releaseDate } = req.body;
        const movie = new Movie({ name, releaseDate });
        await movie.save();
        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMovies = async (req, res) => {
    try {
        const movies = await Movie.find().populate('reviews');
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const getMoviesById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id).populate('reviews');
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const updateMovie = async (req, res) => {
    try {
        const { name, releaseDate } = req.body;
        const movie = await Movie.findByIdAndUpdate(req.params.id, { name, releaseDate }, { new: true });
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) return res.status(404).json({ error: 'Movie not found' });
        await Review.deleteMany({ movie: movie._id });
        res.json({ message: 'Movie deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const searchMoviesAndReview = async (req, res) => {
    try {
        const { search } = req.query;
        const searchString = String(search).toLowerCase(); // Convert search parameter to lowercase string
        const movies = await Movie.find({ name: { $regex: searchString, $options: 'i' } });
        res.json({ movies });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};