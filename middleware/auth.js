const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const auth = (req, res, next) => {
  try {

    const token = req.header("Authorization");

    if (!token) {
      logger.warn("Access attempt without token");
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    let decodedToken = token;
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
    logger.warn(`Invalid token attempted: ${error.message}`);
    res.status(401).json({
      message: "Invalid Token",
    });
  }
};

module.exports = auth;