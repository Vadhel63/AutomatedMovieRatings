const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://vadhelmilan7:i3115M0ZcJJMexHK@SDP-6.t9u8c.mongodb.net/AutomatedMovieRatings?retryWrites=true&w=majority&appName=SDP-6"
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));
