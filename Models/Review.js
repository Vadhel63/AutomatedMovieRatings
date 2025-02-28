const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  Description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    Default: 2,
  },
  LikeCount: {
    type: Number,
    default: 0,
  },
  DislikeCount: {
    type: Number,
    default: 0,
  },
  User: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  Movie: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the User model
module.exports = mongoose.model("Review", ReviewSchema);
