const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  MovieRating: {
    type: Number,
  },
  Type: {
    type: String,
    default: "Romantic",
  },

  MovieImage: {
    type: String,
  },
  ReviewsCount: {
    type: Number,
    default: 0,
  },
  Producer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  RealesedDate: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the User model
module.exports = mongoose.model("Movie", MovieSchema);
