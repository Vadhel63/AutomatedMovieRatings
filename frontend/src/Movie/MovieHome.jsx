import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieService from "./MovieService";
import "./MovieHome.css";
import SearchMovies from "../components/SearchMovie";
const MovieHome = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      const userData = JSON.parse(atob(token.split(".")[1])); // Decode the token
      if (userData.role !== "Producer") {
        navigate("/home"); // Redirect to home if not a Producer
      } else {
        fetchMovies();
      }
    }
  }, [navigate]);

  const fetchMovies = async () => {
    try {
      const response = await MovieService.getMovies();
      setMovies(response.data.movies);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  const handleAddMovie = () => {
    navigate("/MovieForm");
  };

  const handleEditMovie = (movieId) => {
    navigate(`/MovieForm/${movieId}`);
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await MovieService.deleteMovie(movieId);
      fetchMovies(); // Refresh the list after deletion
    } catch (error) {
      console.error("Failed to delete movie:", error);
    }
  };

  return (
    <div className="movie-home-container">
      <SearchMovies />
      <div className="movie-home-header">
        <h1>Movie Home</h1>
        <button className="add-movie-button" onClick={handleAddMovie}>
          Add Movie
        </button>
      </div>
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <h2>{movie.Name}</h2>
            <p>{movie.Description}</p>
            <div className="movie-actions">
              <button onClick={() => handleEditMovie(movie._id)}>Edit</button>
              <button onClick={() => handleDeleteMovie(movie._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieHome;
