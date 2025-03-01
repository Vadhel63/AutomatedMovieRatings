import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaFilm,
  FaAlignLeft,
  FaCalendarAlt,
  FaImage,
  FaTag,
} from "react-icons/fa";
import MovieService from "./MovieService";
import Header from "../components/Header"; // Import Header component

const MovieForm = () => {
  const { id } = useParams(); // Get the movie ID from the URL (if editing)
  const navigate = useNavigate();
  const [movie, setMovie] = useState({
    Name: "",
    Description: "",
    Type: "Romantic",
    MovieImage: null, // Changed to store the file object
    Producer: "",
    RealesedDate: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      const userData = JSON.parse(atob(token.split(".")[1])); // Decode the token
      if (userData.role !== "Producer") {
        navigate("/home"); // Redirect to home if not a Producer
      } else {
        setMovie((prevMovie) => ({
          ...prevMovie,
          Producer: userData.userId, // Set the Producer to the logged-in user's ID
        }));
        if (id) {
          fetchMovie(id); // Fetch movie details if editing
        }
      }
    }
  }, [navigate, id]);

  // Fetch movie details for editing
  const fetchMovie = async (movieId) => {
    try {
      const response = await MovieService.getMovieById(movieId);
      const movieData = response.data.movie;
      setMovie({
        ...movieData,
        RealesedDate: movieData.RealesedDate.split("T")[0], // Format date for input field
      });
    } catch (error) {
      console.error("Failed to fetch movie:", error);
      setError("Failed to load movie details. Please try again.");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovie({ ...movie, [name]: value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMovie({ ...movie, MovieImage: file });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("Name", movie.Name);
      formData.append("Description", movie.Description);
      formData.append("Type", movie.Type);
      formData.append("Producer", movie.Producer);
      formData.append("RealesedDate", movie.RealesedDate);
      if (movie.MovieImage) {
        formData.append("MovieImage", movie.MovieImage);
      }

      if (id) {
        // Update existing movie
        await MovieService.updateMovie(id, formData);
        setSuccess("Movie updated successfully!");
      } else {
        // Add new movie
        await MovieService.addMovie(formData);
        setSuccess("Movie added successfully!");
      }

      // Redirect to MovieHome after a short delay
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (error) {
      console.error("Failed to save movie:", error);
      setError("Failed to save movie. Please check your inputs and try again.");
    }
  };

  const movieTypes = [
    { value: "Romantic", label: "Romantic" },
    { value: "Action", label: "Action" },
    { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" },
    { value: "Horror", label: "Horror" },
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Thriller", label: "Thriller" },
    { value: "Documentary", label: "Documentary" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-3xl mx-auto pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaFilm className="mr-2" />
              {id ? "Edit Movie Details" : "Add New Movie"}
            </h1>
            <p className="mt-1 text-blue-100">
              {id
                ? "Update information for your existing movie"
                : "Share your film with the world"}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-6 mt-4">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 mx-6 mt-4">
              <p className="font-medium">Success</p>
              <p>{success}</p>
            </div>
          )}

          {/* Form */}
          <form className="px-6 py-8 space-y-6" onSubmit={handleSubmit}>
            {/* Movie Name */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="Name"
              >
                Movie Title
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaFilm className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="Name"
                  name="Name"
                  value={movie.Name}
                  onChange={handleChange}
                  required
                  className="pl-10 appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter movie title"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="Description"
              >
                Description
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <FaAlignLeft className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="Description"
                  name="Description"
                  value={movie.Description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="pl-10 appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Describe the movie plot, characters, and other interesting details"
                />
              </div>
            </div>

            {/* Movie Type */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="Type"
              >
                Movie Genre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaTag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="Type"
                  name="Type"
                  value={movie.Type}
                  onChange={handleChange}
                  className="pl-10 appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {movieTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Movie Image Upload */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="MovieImage"
              >
                Movie Poster
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaImage className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="file"
                  id="MovieImage"
                  name="MovieImage"
                  onChange={handleFileChange}
                  className="pl-10 appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  accept="image/*"
                />
              </div>
            </div>

            {/* Released Date */}
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="RealesedDate"
              >
                Release Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="RealesedDate"
                  name="RealesedDate"
                  value={movie.RealesedDate}
                  onChange={handleChange}
                  className="pl-10 appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Preview Card */}
            {movie.Name && (
              <div className="mt-8 border rounded-lg p-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Preview
                </h3>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/4 flex-shrink-0 mb-4 md:mb-0">
                    {movie.MovieImage ? (
                      <img
                        src={
                          typeof movie.MovieImage === "string"
                            ? movie.MovieImage
                            : URL.createObjectURL(movie.MovieImage)
                        }
                        alt={movie.Name}
                        className="w-full h-40 md:h-48 object-cover rounded shadow"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150x225?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-40 md:h-48 bg-gray-200 rounded shadow flex items-center justify-center">
                        <FaImage className="text-gray-400 text-4xl" />
                      </div>
                    )}
                  </div>
                  <div className="md:ml-6 flex-grow">
                    <h4 className="text-xl font-bold">{movie.Name}</h4>
                    <p className="text-sm text-gray-500 mb-2">
                      {movie.Type}{" "}
                      {movie.RealesedDate &&
                        ` • Released: ${new Date(
                          movie.RealesedDate
                        ).toLocaleDateString()}`}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {movie.Description.substring(0, 150)}
                      {movie.Description.length > 150 ? "..." : ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {id ? "Update Movie" : "Add Movie"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MovieForm;
