const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const HttpError = require("../Models/http-errors");
const mongoose = require("mongoose");
const { upload } = require("../middleware/Cloudinary");
router.post("/signup", async (req, res, next) => {
  const { UserName, Email, Password, Role } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ Email: Email });
  } catch (err) {
    const error = new HttpError("Signup failed, please try again", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User is already present", 422);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(Password, 12);

  const currentTime = new Date();

  const createdUser = new User({
    UserName: UserName,
    Email: Email,
    Password: hashedPassword,
    Role: Role,
    createdAt: currentTime,
    updatedAt: currentTime,
  });

  try {
    await createdUser.save();
    const payload = { userId: createdUser._id, Role: createdUser.Role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token: token, user: createdUser });
  } catch (err) {
    console.error("Error saving user:", err); // Log the error for debugging
    const error = new HttpError("Signup failed, please try again", 500);
    return next(error);
  }
});
router.post("/login", async (req, res, next) => {
  const { Email, Password } = req.body;
  const identifiedUser = await User.findOne({ Email: Email });

  if (!identifiedUser) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  const isValidPassword = await bcrypt.compare(
    Password,
    identifiedUser.Password
  );

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials", 401);
    return next(error);
  }

  const token = jwt.sign(
    { userId: identifiedUser._id, role: identifiedUser.Role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // You may want to send back user data or a token upon successful login
  res.json({ token: token, user: identifiedUser });
});
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later.",
      500
    );
    return next(error);
  }
});
// Get logged-in user's profile
router.get("/profile", auth, async (req, res, next) => {
  try {
    const userId = req.userData?.userId; // Set by the authentication middleware
    if (!userId) {
      return next(new HttpError("Unauthorized access.", 401));
    }

    const user = await User.findById(userId, "-password"); // Exclude sensitive data like password
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }
    console.log(user);
    res.status(200).json({ user });
  } catch (err) {
    const error = new HttpError(
      "Fetching profile failed, please try again later.",
      500
    );
    next(error);
  }
});

// Get user by ID
router.get("/:id", async (req, res, next) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new HttpError("Invalid user ID format.", 400));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }
    res.json({ user });
  } catch (err) {
    const error = new HttpError(
      "Fetching user failed, please try again later.",
      500
    );
    return next(error);
  }
});

/// Update user
router.put("/:id", upload.single("ProfileImage"), async (req, res, next) => {
  const userId = req.params.id;
  const { UserName, Email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new HttpError("Invalid user ID format.", 400));
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new HttpError("User not found.", 404));
    }

    // Update fields if provided in the request body
    if (UserName) user.UserName = UserName;
    if (Email) user.Email = Email;

    // Check if an image was uploaded
    if (req.file) {
      user.ProfileImage = req.file.path; // Cloudinary URL
    }

    user.updatedAt = new Date();
    await user.save();

    console.log("Updated user:", user);
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    return next(new HttpError("Updating user failed, please try again.", 500));
  }
});

// Delete user
router.delete("/:id", async (req, res, next) => {
  const userId = req.params.id;

  console.log("Received user ID for deletion:", userId); // Log the received user ID

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new HttpError("Invalid user ID format.", 400));
  }

  try {
    const response = await User.findByIdAndDelete(userId);
    if (!response) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User data deleted successfully");
    res.status(200).json({ message: "User successfully deleted" });
  } catch (err) {
    console.error("Error deleting user:", err); // Log the error
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

module.exports = router;
