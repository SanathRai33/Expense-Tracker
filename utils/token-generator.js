const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    isPremium: user.isPremium,
  };

  const secretKey = process.env.JWT_SECRET;

  return jwt.sign(payload, secretKey);
};

module.exports = generateToken;