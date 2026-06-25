import { useState, useEffect, useCallback } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";

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

  return (
    <div style={{ maxWidth: "500px", margin: "60px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>My Tasks</h2>
        <button onClick={onLogout} style={{ cursor: "pointer" }}>
          Logout
        </button>
      </div>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="New task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
          Add
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <span
              onClick={() => handleToggle(task)}
              style={{
                cursor: "pointer",
                textDecoration: task.completed ? "line-through" : "none",
                color: task.completed ? "#888" : "#000",
                flex: 1,
              }}
            >
              {task.title}
            </span>
            <button onClick={() => handleDelete(task._id)} style={{ cursor: "pointer" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && <p style={{ color: "#888" }}>No tasks yet. Add one above!</p>}
    </div>
  );
}

export default TaskList;
