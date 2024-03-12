import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Movie {
  _id: string;
  name: string;
}

interface Review {
  movieId: string;
  reviewerName: string;
  rating: number;
  comments: string;
}

function AddReview() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [review, setReview] = useState<Review>({
    movieId: "",
    reviewerName: "",
    rating: 0,
    comments: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://moviecriticserver.onrender.com/api/movies")
      .then((res) => setMovies(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReview({ ...review, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://moviecriticserver.onrender.com/api/reviews", review);
      setReview({
        movieId: "",
        reviewerName: "",
        rating: 0,
        comments: "",
      });

      navigate(`/movies/${res.data.movie}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center" data-aos="fade">
      <div className="container mx-auto w-11/12 mt-2 px-4">
        <h2 className="text-2xl font-semibold mb-4">Add new review</h2>
        {movies.length > 0 ? (
          <form onSubmit={handleSubmit} className="max-w-sm space-y-6" data-aos="fade">
            <div className="mb-4">
              <select
                id="movie"
                name="movieId"
                value={review.movieId}
                onChange={handleChange}
                className="border-2 cursor-pointer border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
              >
                <option value="">Select a movie</option>
                {movies.map((movie) => (
                  <option key={movie._id} value={movie._id}>
                    {movie.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <input
                type="text"
                id="reviewerName"
                name="reviewerName"
                placeholder="Your name"
                value={review.reviewerName}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
              />
            </div>
            <div className="mb-4">
              <input
                type="number"
                id="rating"
                name="rating"
                placeholder="Rating out of 10"
                min="1"
                max="10"
                value={review.rating}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
              />
            </div>
            <div className="mb-4">
              <textarea
                id="comments"
                name="comments"
                placeholder="Review comments"
                value={review.comments}
                onChange={handleChange}
                className="border-2 border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
              />
            </div>
            <button type="submit" className="text-white bg-[#6558F5] rounded py-2 px-4 shadow">
              Add review
            </button>
          </form>
        ) : (
          <p className="text-lg" data-aos="fade">
            {movies.length == 0 ? "Loading..." : "No movies found :("}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddReview;
