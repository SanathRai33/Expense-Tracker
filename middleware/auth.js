const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {

    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    let decodedToken = token;
    // Handle "Bearer token" format if present
    if (token.startsWith("Bearer ")) {
      decodedToken = token.slice(7);
    }

    const decoded = jwt.verify(
      decodedToken,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = auth;