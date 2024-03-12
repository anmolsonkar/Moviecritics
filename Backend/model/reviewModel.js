import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const reviewSchema = new Schema({
    movie: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
    reviewerName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 10 },
    comments: { type: String, required: true }
});

const Review = model('Review', reviewSchema);

export default Review;
