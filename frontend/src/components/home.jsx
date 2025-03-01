import { Link } from "react-router-dom";
import Header from "./Header"; // Import the Header component
import SearchMovies from "./SearchMovie";
import MovieHome from "../Movie/MovieHome";
const Home = () => (
  <div>
    <Header /> {/* Add Header here */}
    <MovieHome />
  </div>
);

export default Home;
