import { Link } from "react-router-dom";
import Header from "./Header"; // Import the Header component
import SearchMovies from "./SearchMovie";

const Home = () => (
  <div>
    <Header /> {/* Add Header here */}
    <h1>Welcome to Home</h1>
    <Link to="/profile">Go to Profile</Link>
    <SearchMovies />
  </div>
);

export default Home;
