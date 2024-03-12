import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface Movie {
  _id: string;
  name: string;
  releaseDate: string;
  averageRating: number | null;
  reviews: Review[];
}

interface Review {
  _id: string;
  reviewerName: string | null;
  rating: number;
  comments: string;
}

interface NewReview {
  reviewerName: string;
  rating: number;
  comments: string;
}

interface EditReview extends NewReview {
  _id: string;
}

function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [newReview, setNewReview] = useState<NewReview>({
    reviewerName: "",
    rating: 0,
    comments: "",
  });
  const [editReview, setEditReview] = useState<EditReview | null>(null);
  const [editMovie, setEditMovie] = useState<boolean>(false);
  const [editedMovie, setEditedMovie] = useState<Partial<Movie> | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/reviews", {
        ...newReview,
        movieId: id,
      });
      if (movie) {
        setMovie({ ...movie, reviews: [...movie.reviews, res.data] });
        setNewReview({ reviewerName: "", rating: 0, comments: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/reviews/${reviewId}`);
      if (movie) {
        setMovie({
          ...movie,
          reviews: movie.reviews.filter((review) => review._id !== reviewId),
        });
        navigate(`/movies/${id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditReview({ ...review, rating: review.rating } as EditReview);
  };

  const handleUpdateReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editReview) {
      try {
        const res = await axios.put(
          `http://localhost:4000/api/reviews/${editReview._id}`,
          editReview
        );
        if (movie) {
          setMovie({
            ...movie,
            reviews: movie.reviews.map((review) =>
              review._id === res.data._id ? res.data : review
            ),
          });
          setEditReview(null);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditReview(null);
  };

  const handleDeleteMovie = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/movies/${id}`);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditMovie = () => {
    setEditMovie(true);
    if (movie) {
      setEditedMovie(movie);
    } else {
      setEditedMovie(null);
    }
  };

  const handleUpdateMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedMovie) {
      try {
        // Fetch the previous movie data
        const prevMovieRes = await axios.get(`http://localhost:4000/api/movies/${id}`);
        const prevMovieData: Movie = prevMovieRes.data;

        // Update the movie details on the server
        await axios.put(`http://localhost:4000/api/movies/${id}`, editedMovie);

        // Fetch the updated movie data from the server
        const updatedMovieRes = await axios.get(`http://localhost:4000/api/movies/${id}`);
        const updatedMovieData: Movie = updatedMovieRes.data;

        // Merge the updated movie data with the previous reviews
        const mergedMovieData: Movie = {
          ...updatedMovieData,
          reviews: prevMovieData.reviews,
        };

        setMovie(mergedMovieData);
        setEditMovie(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!movie) return <div>Loading...</div>;

  return (
    <div>
      <div className="p-4 mb-4 items-center">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold">{movie.name}</h2>
          {movie.averageRating && (
            <p className="text-[#6558F5] text-4xl lg:hidden md:hidden">{movie.averageRating}/10</p>
          )}
          <div className="space-x-6 items-center lg:flex hidden ">
            {movie.averageRating && (
              <p className="text-[#6558F5] text-4xl">{movie.averageRating}/10</p>
            )}
            <button
              onClick={handleEditMovie}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
            >
              Edit Movie
            </button>
            <button
              onClick={handleDeleteMovie}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Delete Movie
            </button>
          </div>
        </div>
        <p className="text-gray-500 mt-3">
          Release Date : {format(new Date(movie.releaseDate), "do MMMM, yyyy")}
        </p>
        <div className="space-x-6 items-center flex lg:hidden md:hidden  my-4">
          <button
            onClick={handleEditMovie}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
          >
            Edit Movie
          </button>
          <button
            onClick={handleDeleteMovie}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Delete Movie
          </button>
        </div>

        {editMovie && (
          <form onSubmit={handleUpdateMovie} className="space-y-6 mt-6">
            <div className="mb-2">
              <input
                required
                type="text"
                id="movieName"
                value={editedMovie?.name || ""}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, name: e.target.value } as Partial<Movie>)
                }
                className="border-2 border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
              />
            </div>
            <div className="mb-4">
              <input
                required
                type="date"
                id="releaseDate"
                value={editedMovie?.releaseDate || ""}
                onChange={(e) =>
                  setEditedMovie({ ...editedMovie, releaseDate: e.target.value } as Partial<Movie>)
                }
                className="border-2 border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditMovie(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="p-4 mb-4">
        <ul>
          {movie.reviews.map((review) => (
            <li key={review._id} className="border-2 p-4 mt-8 first:mt-0 border-gray-200 py-4">
              {editReview && editReview._id === review._id ? (
                <form onSubmit={handleUpdateReview}>
                  <div className="mb-2">
                    <input
                      type="text"
                      id="reviewerName"
                      placeholder="Your name"
                      value={editReview.reviewerName || ""}
                      onChange={(e) =>
                        setEditReview({ ...editReview, reviewerName: e.target.value })
                      }
                      className="border-2 cursor-pointer border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      required
                      type="number"
                      id="rating"
                      placeholder="Rating out of 10"
                      min="1"
                      max="10"
                      value={editReview.rating}
                      onChange={(e) =>
                        setEditReview({ ...editReview, rating: parseInt(e.target.value) })
                      }
                      className="border-2 cursor-pointer border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
                    />
                  </div>
                  <div className="mb-4">
                    <textarea
                      required
                      placeholder="Review comment"
                      id="comments"
                      value={editReview.comments}
                      onChange={(e) => setEditReview({ ...editReview, comments: e.target.value })}
                      className="border-2 cursor-pointer border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="submit"
                      className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="lg:space-y-7 space-y-5">
                    <p className="text-gray-700">{review.comments}</p>
                    <div>
                      {review.reviewerName !== "" ? (
                        <p className="italic">By {review.reviewerName}</p>
                      ) : (
                        <p className="italic">By Anonymous</p>
                      )}
                    </div>
                    <div className="justify-end space-x-5 lg:hidden md:hidden">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-5">
                    <p className="text-[#6558F5]">{review.rating}/10</p>

                    <div className="justify-end space-x-5 lg:flex md:flex hidden">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Add new review</h2>
        <form onSubmit={handleSubmitReview} className="max-w-sm space-y-6 mt-5">
          <div className="mb-2">
            <input
              type="text"
              id="reviewerName"
              placeholder="Your name"
              value={newReview.reviewerName}
              onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
              className="border-2 cursor-pointer border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
            />
          </div>
          <div className="mb-2">
            <input
              type="number"
              id="rating"
              placeholder="Rating out of 10"
              min="1"
              max="10"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
              className="border-2 cursor-pointer border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
            />
          </div>
          <div className="mb-4">
            <textarea
              id="comments"
              placeholder="Review comments"
              value={newReview.comments}
              onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })}
              className="border-2 cursor-pointer border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
            />
          </div>
          <button type="submit" className="text-white bg-[#6558F5] rounded py-2 px-4 shadow">
            Add review
          </button>
        </form>
      </div>
    </div>
  );
}

export default MovieDetails;
