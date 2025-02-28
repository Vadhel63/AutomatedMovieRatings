import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const SearchMovies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return; // Prevent empty search

    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");

    try {
      const response = await API.get(`/Movie/search?term=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data.movies);
    } catch (error) {
      console.error("Failed to search movies:", error);
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Search Movies</h1>
      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-l px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </form>

      {isLoading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Display message if no movies are found */}
      {!isLoading && searchResults.length === 0 && searchTerm.trim() !== "" && (
        <p className="text-center text-gray-600">No movies found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {searchResults.map((movie) => (
          <div
            key={movie._id}
            onClick={() => handleMovieClick(movie._id)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            <img
              src={movie.MovieImage}
              alt={movie.Name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{movie.Name}</h3>
              <p className="text-gray-600 mb-2">{movie.Description}</p>
              <p className="text-gray-700">Type: {movie.Type}</p>
              <p className="text-gray-700">
                Released Date:{" "}
                {new Date(movie.RealesedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMovies;
