const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Role: {
    type: String,
    enum: ["User", "Producer", "Admin"],
    default: "User",
  },
  Status: {
    type: String,
    enum: ["Accepted", "Rejected", "Pending"],
    default: "Pending",
  },
  ProfileImage: {
    type: String,
  },
  History: [
    {
      movieId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the movie
        ref: "Movie",
        required: true,
      },
      visitedAt: {
        type: Date,
        default: Date.now, // Automatically stores the visit timestamp
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to keep the History array only for the past 7 days
UserSchema.pre("save", function (next) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Filter History to keep only the records from the past 7 days
  this.History = this.History.filter(
    (record) => record.visitedAt >= sevenDaysAgo
  );
  next();
});

// Export the User model
module.exports = mongoose.model("User", UserSchema);
