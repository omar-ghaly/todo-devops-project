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

function formatDate(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false;
  return new Date(dueDate) < new Date();
}

function TaskList({ token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newCategory, setNewCategory] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editCategory, setEditCategory] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

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
    await createTask(token, {
      title: newTitle,
      priority: newPriority,
      category: newCategory,
      dueDate: newDueDate || null,
    });
    setNewTitle("");
    setNewPriority("medium");
    setNewCategory("");
    setNewDueDate("");
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

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditPriority(task.priority || "medium");
    setEditCategory(task.category || "");
    setEditDueDate(task.dueDate ? task.dueDate.slice(0, 10) : "");
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim()) return;
    await updateTask(token, id, {
      title: editTitle,
      priority: editPriority,
      category: editCategory,
      dueDate: editDueDate || null,
    });
    setEditingId(null);
    loadTasks();
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const visibleTasks = tasks
    .filter((t) => {
      if (filter === "completed") return t.completed;
      if (filter === "active") return !t.completed;
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

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

        <form onSubmit={handleAdd} className="add-task-form-full">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="form-input"
          />
          <div className="add-task-row">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="form-input form-select"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
            <input
              type="text"
              placeholder="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="form-input"
            />
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="form-input"
            />
            <button type="submit" className="btn btn-primary btn-add">
              Add
            </button>
          </div>
        </form>

        {error && <p className="task-error">{error}</p>}

        <div className="tasks-toolbar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input search-input"
          />
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-tab ${filter === "active" ? "active" : ""}`}
              onClick={() => setFilter("active")}
            >
              Active
            </button>
            <button
              className={`filter-tab ${filter === "completed" ? "active" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        {visibleTasks.map((task) =>
          editingId === task._id ? (
            <div className="task-card task-card-editing" key={task._id}>
              <div className="edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="form-input"
                />
                <div className="add-task-row">
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="form-input form-select"
                  >
                    <option value="low">Low priority</option>
                    <option value="medium">Medium priority</option>
                    <option value="high">High priority</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="edit-actions">
                  <button onClick={() => saveEdit(task._id)} className="btn btn-primary" style={{ width: "auto" }}>
                    Save
                  </button>
                  <button onClick={cancelEdit} className="btn btn-secondary" style={{ width: "auto" }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
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
                <div className="task-badges">
                  <span className={`badge badge-${task.priority || "medium"}`}>
                    {task.priority || "medium"}
                  </span>
                  {task.category && <span className="badge badge-category">{task.category}</span>}
                  {task.dueDate && (
                    <span className={`badge ${isOverdue(task.dueDate, task.completed) ? "badge-overdue" : "badge-due"}`}>
                      Due {formatDate(task.dueDate)}
                    </span>
                  )}
                </div>
                <div className="task-meta">
                  <span>Created {formatDateTime(task.createdAt)}</span>
                  {task.completed && (
                    <span className="done-badge">✓ Done {formatDateTime(task.updatedAt)}</span>
                  )}
                </div>
              </div>
              <div className="task-actions">
                <button onClick={() => startEdit(task)} className="btn-icon">
                  Edit
                </button>
                <button onClick={() => handleDelete(task._id)} className="btn-danger">
                  Delete
                </button>
              </div>
            </div>
          )
        )}

        {visibleTasks.length === 0 && tasks.length > 0 && (
          <p className="empty-state">No tasks match your filter.</p>
        )}
        {tasks.length === 0 && (
          <p className="empty-state">No tasks yet. Add one above to get started!</p>
        )}
      </div>
    </div>
  );
}

export default TaskList;
