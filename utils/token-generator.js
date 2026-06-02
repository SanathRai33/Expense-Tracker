const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
    const secretKey = process.env.JWT_SECRET;

    return jwt.sign(payload, secretKey);
};

module.exports = generateToken;