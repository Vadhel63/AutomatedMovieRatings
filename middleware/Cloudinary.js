const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Storage for Profile Images Only
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "SDP6_Profile",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Initialize Multer for image uploads
const upload = multer({ storage });

module.exports = { upload };
