import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaTheaterMasks,
  FaVideo,
} from "react-icons/fa";
import API from "../api";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    Password: "",
    Role: "User",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        "http://localhost:5000/user/signup",
        formData
      );
      setSuccess("Registration successful!");
      const token = response.data.token;
      localStorage.setItem("authToken", token); // Save the token for future requests
      setError("");
      navigate("/home"); // Redirect to Home after registration
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Join Movie App
          </h2>
          <p className="text-gray-600 mb-6">
            Create your account and start your movie journey
          </p>

          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p className="font-medium">Registration Error</p>
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded">
              <p className="font-medium">Success!</p>
              <p>{success}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="UserName"
            >
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="UserName"
                name="UserName"
                type="text"
                value={formData.UserName}
                onChange={handleChange}
                required
                className="pl-10 appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Choose a username"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="Email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="Email"
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                required
                className="pl-10 appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="Password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="Password"
                name="Password"
                type="password"
                value={formData.Password}
                onChange={handleChange}
                required
                className="pl-10 appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Create a secure password"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              I want to join as:
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                  formData.Role === "User"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, Role: "User" }))
                }
              >
                <FaTheaterMasks className="h-10 w-10 text-blue-500 mb-2" />
                <p className="font-medium text-gray-800">User</p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Watch and review movies
                </p>
                <input
                  type="radio"
                  name="Role"
                  value="User"
                  checked={formData.Role === "User"}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>

              <div
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${
                  formData.Role === "Producer"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, Role: "Producer" }))
                }
              >
                <FaVideo className="h-10 w-10 text-purple-500 mb-2" />
                <p className="font-medium text-gray-800">Producer</p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  Add and manage movies
                </p>
                <input
                  type="radio"
                  name="Role"
                  value="Producer"
                  checked={formData.Role === "Producer"}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Create Account
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
