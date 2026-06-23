const express = require("express");
const cors = require("cors");
const { port } = require("./config/env");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB, then start the server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
