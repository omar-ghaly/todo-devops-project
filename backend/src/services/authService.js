const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret, jwtExpiresIn } = require("../config/env");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, { expiresIn: jwtExpiresIn });
};

const registerUser = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    const error = new Error("User with this email or username already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ username, email, password });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
  generateToken,
};
