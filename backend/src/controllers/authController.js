const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are all required",
      });
    }

    const result = await registerUser({ username, email, password });

    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
