import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header"; // Import the Header component
import MovieHome from "../Movie/MovieHome";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const userData = JSON.parse(atob(token.split(".")[1])); // Decode the token
      if (userData.role === "Admin") {
        navigate("/admin-dashboard"); // Redirect admins to the Admin Dashboard
      }
    }
  }, [navigate]);

  return (
    <div>
      <Header /> {/* Add Header here */}
      <MovieHome />
    </div>
  );
};

export default Home;
