import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const movieSchema = new Schema({
    name: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    averageRating: { type: Number, default: null },
    reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }]
});

movieSchema.pre('remove', async function (next) {
    const Movie = model('Movie');
    await Review.deleteMany({ movie: this._id });
    next();
});

const Movie = model('Movie', movieSchema);

export default Movie;
