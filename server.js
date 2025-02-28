const db = require("./db");
const { User } = require("./Models/User");
const { Movie } = require("./Models/Movie");
const { Review } = require("./Models/Review");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

require("dotenv").config();

const bodyParser = require("body-parser");
// Middleware for parsing JSON
app.use(express.json()); // Built-in middleware
app.use(bodyParser.urlencoded({ extended: true }));
const UserRoutes = require("./Routes/UserRoutes");
const MovieRoutes = require("./Routes/MovieRoutes");
const ReviewRoutes = require("./Routes/ReviewRoutes");
app.use("/user", UserRoutes);
app.use("/Movie", MovieRoutes);
app.use("/review", ReviewRoutes);
app.listen(5000, () => {
  console.log("server is listing port no:5000");
});
