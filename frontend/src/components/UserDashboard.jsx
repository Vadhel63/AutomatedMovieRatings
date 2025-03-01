"use client";

import { useState, useEffect } from "react";
import { Search, Filter, History, Star, Film, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assests/s10.jpg";

const UserDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [movies, setMovies] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [recentlyVisited, setRecentlyVisited] = useState([]);
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [movieReviews, setMovieReviews] = useState([]);
  const navigate = useNavigate();

  // Fetch user data and token from localStorage or context
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      setAuthToken(token);
      setUser(userData);
    }
  }, []);

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://localhost:5000/Movie/all", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setMovies(data);
          } else if (
            data &&
            typeof data === "object" &&
            Array.isArray(data.movies)
          ) {
            setMovies(data.movies);
          } else {
            console.error("API did not return an array of movies", data);
          }
        } else {
          console.error("Failed to fetch movies");
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    if (authToken) {
      fetchMovies();
    }
  }, [authToken]);

  // Handle movie click to track recently visited movies
  const handleMovieClick = (movie) => {
    const updatedRecentlyVisited = [
      movie,
      ...recentlyVisited.filter((m) => m.id !== movie.id).slice(0, 4),
    ];
    setRecentlyVisited(updatedRecentlyVisited);
  };

  // Handle search functionality
  const handleSearch = async (term) => {
    try {
      const response = await fetch(
        `http://localhost:5000/Movie/search?term=${term}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMovies(data.movies);
      } else {
        console.error("Failed to search movies");
      }
    } catch (error) {
      console.error("Error searching movies:", error);
    }
  };

  // Fetch reviews for a specific movie
  const fetchMovieReviews = async (movieId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/reviews?movieId=${movieId}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMovieReviews(data.reviews);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleWriteReview = (movie) => {
    setSelectedMovie(movie);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    try {
      const response = await fetch("http://localhost:5000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          Description: reviewText,
          rating: reviewRating,
          User: user.userId,
          Movie: selectedMovie._id,
        }),
      });

      if (response.ok) {
        console.log("Review submitted successfully");
        fetchMovieReviews(selectedMovie.id); // Refresh reviews after submission
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }

    setShowReviewModal(false);
    setReviewText("");
    setReviewRating(5);
    setSelectedMovie(null);
  };

  // Define filteredMovies here
  const filteredMovies = Array.isArray(movies)
    ? movies.filter(
        (movie) =>
          (selectedFilter === "All" || movie.Type === selectedFilter) &&
          movie.Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header Component */}
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Film size={24} />
            <h1 className="text-xl font-bold">MovieHub</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                className="px-4 py-2 rounded-lg text-gray-800 focus:outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              <Search
                className="absolute right-3 top-2.5 text-gray-500"
                size={18}
              />
            </div>

            <div
              className="cursor-pointer group relative"
              onClick={() => navigate("/profile")}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                <img
                  src={user?.user?.ProfileImage || defaultAvatar}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden group-hover:block absolute right-0 top-12 bg-white text-gray-800 rounded-md shadow-lg p-2">
                <p className="whitespace-nowrap">Go to Profile</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar with Filters and History */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center mb-4">
              <Filter size={20} className="mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Romantic",
                "Action",
                "Comedy",
                "Drama",
                "Sci-Fi",
                "Fantasy",
                "Crime",
                "Documentary",
              ].map((filter) => (
                <button
                  key={filter}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedFilter === filter
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-4">
              <History size={20} className="mr-2 text-gray-600" />
              <h2 className="text-lg font-semibold">Watch History</h2>
            </div>
            <div className="space-y-3">
              {(showAllHistory
                ? recentlyVisited
                : recentlyVisited.slice(0, 5)
              ).map((movie, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0">
                    <img
                      src={
                        movie.MovieImage ||
                        "/placeholder.svg?height=40&width=40"
                      }
                      alt={movie.Name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{movie.Name}</p>
                    <p className="text-xs text-gray-500">Visited recently</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-4 text-sm text-blue-600 hover:underline"
              onClick={() => setShowAllHistory(!showAllHistory)}
            >
              {showAllHistory ? "Show Less" : "View All History"}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          {/* Movie Recommendations */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Star size={20} className="mr-2 text-yellow-500" />
              Recommended for You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {movies.slice(0, 2).map((movie) => (
                <div
                  key={movie.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden flex"
                >
                  <div className="w-24 h-36 flex-shrink-0">
                    <img
                      src={movie.MovieImage || "/placeholder.svg"}
                      alt={movie.Name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{movie.Name}</h3>
                      <p className="text-sm text-gray-600">{movie.Type}</p>
                      <p className="text-sm text-gray-500">
                        {movie.Description}
                      </p>
                    </div>
                    <div className="flex items-center mt-2">
                      <Star
                        size={16}
                        className="text-yellow-500 mr-1"
                        fill="currentColor"
                      />
                      <span className="text-sm">{movie.MovieRating}/5</span>
                    </div>
                    <button
                      className="mt-2 text-sm text-blue-600 hover:underline"
                      onClick={() => handleWriteReview(movie)}
                    >
                      Write Review
                    </button>
                    <button
                      className="mt-2 text-sm text-blue-600 hover:underline"
                      onClick={() => {
                        setSelectedMovie(movie);
                        setShowReviews(true);
                        fetchMovieReviews(movie.id);
                      }}
                    >
                      View Reviews
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Movie Browse Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Browse Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  onClick={() => handleMovieClick(movie)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        movie.MovieImage ||
                        "/placeholder.svg?height=300&width=200"
                      }
                      alt={movie.Name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{movie.Name}</h3>
                    <p className="text-sm text-gray-600">{movie.Type}</p>
                    <p className="text-sm text-gray-500">{movie.Description}</p>
                    <div className="flex items-center mt-2">
                      <Star
                        size={16}
                        className="text-yellow-500 mr-1"
                        fill="currentColor"
                      />
                      <span className="text-sm">{movie.MovieRating}/5</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md">
                        Watch
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md"
                        onClick={() => handleWriteReview(movie)}
                      >
                        Review
                      </button>
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md"
                        onClick={() => {
                          setSelectedMovie(movie);
                          setShowReviews(true);
                          fetchMovieReviews(movie.id);
                        }}
                      >
                        View Reviews
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Write a Review</h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center mb-4">
                <div className="w-16 h-24 flex-shrink-0 mr-4">
                  <img
                    src={
                      selectedMovie.MovieImage ||
                      "/placeholder.svg?height=300&width=200"
                    }
                    alt={selectedMovie.Name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{selectedMovie.Name}</h4>
                  <p className="text-sm text-gray-600">{selectedMovie.Type}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      className={`cursor-pointer ${
                        star <= reviewRating
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                      fill={star <= reviewRating ? "currentColor" : "none"}
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Share your thoughts about this movie..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  onClick={() => setShowReviewModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={submitReview}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Modal */}
      {showReviews && selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Reviews for {selectedMovie.Name}
              </h3>
              <button
                onClick={() => setShowReviews(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              {movieReviews.length > 0 ? (
                movieReviews.map((review) => (
                  <div key={review._id} className="mb-4">
                    <p className="text-sm text-gray-700">
                      {review.Description}
                    </p>
                    <div className="flex items-center mt-2">
                      <Star
                        size={16}
                        className="text-yellow-500 mr-1"
                        fill="currentColor"
                      />
                      <span className="text-sm">{review.rating}/5</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      By: {review.User?.UserName}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
