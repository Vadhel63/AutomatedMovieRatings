import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/home";
import ProfilePage from "./components/ProfilePage";
import MovieHome from "./Movie/MovieHome";
import MovieService from "./Movie/MovieService";
import MovieForm from "./Movie/MovieForm";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/MovieHome" element={<MovieHome />} />
          <Route path="/MovieService" element={<MovieService />} />
          <Route path="/MovieForm" element={<MovieForm />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
