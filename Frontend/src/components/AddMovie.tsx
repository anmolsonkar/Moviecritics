import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddMovie() {
  const [name, setName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://moviecriticserver.onrender.com/api/movies", {
        name,
        releaseDate: new Date(releaseDate),
      });
      navigate(`/movies/${res.data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-4 mt-2 w-11/12">
      <h2 className="text-2xl font-bold mb-4">Add new movie</h2>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-6">
        <div className="mb-4">
          <input
            required
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
          />
        </div>
        <div className="mb-4">
          <input
            required
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="border-2 border-gray-300 rounded px-4 py-2 block w-full outline-none focus:border-[#6558F5] duration-150"
          />
        </div>
        <button type="submit" className="text-white bg-[#6558F5] rounded py-2 px-4 shadow">
          Create movie
        </button>
      </form>
    </div>
  );
}

export default AddMovie;
