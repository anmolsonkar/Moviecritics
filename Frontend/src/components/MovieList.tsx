import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { format } from "date-fns";

interface Movie {
  _id: string;
  name: string;
  releaseDate: string;
  averageRating: number | null;
}

interface Review {
  movie: any;
  _id: string;
  movieId: string;
  reviewerName: string;
  rating: number;
  comments: string;
}

function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    axios
      .get("https://moviecriticserver.onrender.com/api/movies")
      .then((res) => {
        setMovies(res.data);
        setFilteredMovies(res.data); // Initially show all movies
      })
      .catch((err) => console.error(err));

    axios
      .get("https://moviecriticserver.onrender.com/api/reviews")
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    if (searchTerm === "") {
      setFilteredMovies(movies);
      return;
    }

    const filtered = movies.filter((movie) => {
      const movieName = movie.name.toLowerCase();
      const movieReviews = reviews.filter((review) => review.movie._id === movie._id);
      const comments = movieReviews.map((review) => review.comments.toLowerCase()).join(" ");
      return movieName.includes(searchTerm) || comments.includes(searchTerm);
    });

    setFilteredMovies(filtered);
  };

  return (
    <div className="flex justify-center">
      <div className=" w-11/12">
        <div data-aos="fade">
          <h2 className="text-2xl font-bold mt-2">The best movie reviews site!</h2>
          <span className="flex items-center text-gray-500 mt-7">
            <Search className="absolute ml-2" style={{ fontSize: "24" }} />
            <input
              type="text"
              placeholder="Search for your favourite movie..."
              value={searchTerm}
              onChange={handleSearch}
              className="px-4 p-2 pl-9 py-3 outline-none border-2 focus:border-[#6558F5] duration-150 rounded shadow w-full lg:w-11/12"
            />
          </span>
        </div>
        <ul className="flex flex-wrap mt-5">
          {filteredMovies && filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <li key={movie._id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 p-2" data-aos="fade">
                <Link
                  to={`/movies/${movie._id}`}
                  className="block bg-[#E0DEFD] shadow-md p-4 mb-4 text-lg font-semibold"
                >
                  <span className="space-y-1">
                    <p>{movie.name}</p>
                    <p>Released: {format(new Date(movie.releaseDate), "do MMMM, yyyy")}</p>
                    <p>
                      {movie.averageRating && (
                        <span className="text-[#121212]">
                          Rating: {movie.averageRating.toFixed(1)}/10
                        </span>
                      )}
                    </p>
                  </span>
                </Link>
              </li>
            ))
          ) : (
            <p className="text-lg" data-aos="fade">
              {movies.length == 0 ? "Loading..." : "No movies found :("}
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default MovieList;
