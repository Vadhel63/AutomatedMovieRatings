import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieService from "./MovieService";
import { Film, ArrowLeft } from "lucide-react";

const MovieDetails = () => {
  const { id } = useParams(); // Get the movie ID from the URL
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await MovieService.getMovieById(id);
        setMovie(response.data.movie);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Film className="animate-spin text-indigo-400" size={48} />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400">Movie not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          {/* Movie Image */}
          <div className="w-full h-96 flex items-center justify-center overflow-hidden">
            {movie.MovieImage ? (
              <img
                src={movie.MovieImage}
                alt={movie.Name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-purple-800 to-indigo-800 flex items-center justify-center">
                <Film size={64} className="text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Movie Details */}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-indigo-300">
              {movie.Name}
            </h1>
            <p className="text-gray-300 mb-4">{movie.Description}</p>
            <div className="text-gray-400">
              <p>
                <strong>Genre:</strong> {movie.Type}
              </p>
              <p>
                <strong>Release Date:</strong>{" "}
                {new Date(movie.RealesedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
