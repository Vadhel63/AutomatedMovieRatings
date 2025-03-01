const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId: decoded.userId, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};

// Middleware to check if the user is a Producer
module.exports.isProducer = (req, res, next) => {
  if (req.userData.role !== "Producer") {
    return res.status(403).json({
      message: "Access denied. Only Producers can perform this action.",
    });
  }
  next();
};

module.exports.isAdmin = (req, res, next) => {
  if (req.userData.role !== "Admin") {
    return res.status(403).json({
      message: "Access denied. Only Admin can perform this action.",
    });
  }
  next();
};
