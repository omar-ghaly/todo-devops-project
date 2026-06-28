import { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";

function formatDateTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function TaskList({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks(token);
      setTasks(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load tasks");
    }
  }, [token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: fetch tasks on mount
    loadTasks();
  }, [loadTasks]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createTask(token, newTitle);
    setNewTitle("");
    loadTasks();
  };

  const handleToggle = async (task) => {
    await updateTask(token, task._id, { completed: !task.completed });
    loadTasks();
  };

  const handleDelete = async (id) => {
    await deleteTask(token, id);
    loadTasks();
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="tasks-page">
      <div className="tasks-container">
        <div className="tasks-header">
          <div>
            <h2 className="tasks-title">My Tasks</h2>
            {tasks.length > 0 && (
              <p className="tasks-stats">
                {completedCount} of {tasks.length} completed
              </p>
            )}
          </div>
          <button onClick={onLogout} className="btn btn-secondary" style={{ width: "auto" }}>
            Logout
          </button>
        </div>

        <form onSubmit={handleAdd} className="add-task-form">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="form-input"
          />
          <button type="submit" className="btn btn-primary btn-add">
            Add
          </button>
        </form>

        {error && <p className="task-error">{error}</p>}

        {tasks.map((task) => (
          <div className="task-card" key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task)}
              className="task-checkbox"
            />
            <div className="task-body">
              <div className={`task-title ${task.completed ? "completed" : ""}`}>
                {task.title}
              </div>
              <div className="task-meta">
                <span>Created {formatDateTime(task.createdAt)}</span>
                {task.completed && (
                  <span className="done-badge">✓ Done {formatDateTime(task.updatedAt)}</span>
                )}
              </div>
            </div>
            <button onClick={() => handleDelete(task._id)} className="btn-danger">
              Delete
            </button>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="empty-state">No tasks yet. Add one above to get started!</p>
        )}
      </div>
    </div>
  );
}

export default TaskList;
