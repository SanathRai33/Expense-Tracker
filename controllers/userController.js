const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/token-generator");
const logger = require("../utils/logger");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`);

      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    logger.error(`Error in signup for email: ${req.body.email}`, error);

    // Handles duplicate email index as a second safety layer
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    const isPasswordValid = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for email: ${email}`);

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },

      token,
    });
  } catch (error) {
    logger.error(`Error in login for email: ${req.body.email}`, error);
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
