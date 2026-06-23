const Task = require("../models/Task");

// Create Task
const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Tasks (only for the logged-in user)
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    if (req.body.title !== undefined) {
      task.title = req.body.title;
    }
    if (req.body.completed !== undefined) {
      task.completed = req.body.completed;
    }

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
