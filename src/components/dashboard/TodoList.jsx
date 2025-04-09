import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../../api/mockApi";

// Import icons
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFilter,
} from "react-icons/fa";

const TodoList = () => {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New todo form state
  const [newTodo, setNewTodo] = useState({ title: "", dueDate: "" });

  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", dueDate: "" });

  // Filters and sorting state
  const [filter, setFilter] = useState("all"); // 'all', 'active', 'completed'
  const [sortBy, setSortBy] = useState("dueDate"); // 'dueDate', 'title'
  const [sortDirection, setSortDirection] = useState("asc"); // 'asc', 'desc'

  useEffect(() => {
    loadTodos();
  }, [currentUser.id]);

  const loadTodos = async () => {
    setLoading(true);
    try {
      const data = await fetchTodos(currentUser.id);
      setTodos(data);
    } catch (err) {
      setError("Error loading todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!newTodo.title.trim()) return;

    try {
      const todo = await addTodo(currentUser.id, newTodo);
      setTodos([...todos, todo]);
      setNewTodo({ title: "", dueDate: "" }); // Reset form
    } catch (err) {
      setError("Error adding todo");
      console.error(err);
    }
  };

  const handleToggleComplete = async (todoId, currentStatus) => {
    try {
      const updatedTodo = await updateTodo(todoId, {
        completed: !currentStatus,
      });
      setTodos(todos.map((todo) => (todo.id === todoId ? updatedTodo : todo)));
    } catch (err) {
      setError("Error updating todo");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      setError("Error deleting todo");
      console.error(err);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditForm({ title: todo.title, dueDate: todo.dueDate });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ title: "", dueDate: "" });
  };

  const handleUpdateTodo = async (e) => {
    e.preventDefault();

    if (!editForm.title.trim()) return;

    try {
      const updatedTodo = await updateTodo(editingId, editForm);
      setTodos(
        todos.map((todo) => (todo.id === editingId ? updatedTodo : todo))
      );
      setEditingId(null);
    } catch (err) {
      setError("Error updating todo");
      console.error(err);
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const changeSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      toggleSortDirection();
    } else {
      setSortBy(newSortBy);
      setSortDirection("asc");
    }
  };

  // Filter and sort todos
  const filteredAndSortedTodos = () => {
    let result = [...todos];

    // Apply filter
    if (filter === "active") {
      result = result.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      result = result.filter((todo) => todo.completed);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "dueDate") {
        const dateA = new Date(a.dueDate || "9999-12-31");
        const dateB = new Date(b.dueDate || "9999-12-31");
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  };

  if (loading && todos.length === 0)
    return <div className="loading">Loading todos...</div>;

  return (
    <div className="todo-list-page">
      <h1>Todo List</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Add Todo Form */}
      <div className="todo-form-card">
        <h2>Add New Task</h2>
        <form onSubmit={handleAddTodo} className="todo-form">
          <div className="form-row">
            <div className="form-group">
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
                placeholder="What needs to be done?"
                required
              />
            </div>
            <div className="form-group">
              <div className="date-input-wrapper">
                <FaCalendarAlt className="date-icon" />
                <input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, dueDate: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                <FaPlus /> Add Task
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filters and Sort Controls */}
      <div className="todo-controls">
        <div className="filter-buttons">
          <button
            className={`btn-filter ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`btn-filter ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`btn-filter ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>

        <div className="sort-controls">
          <span className="sort-label">
            <FaFilter /> Sort by:
          </span>
          <button
            className={`btn-sort ${sortBy === "dueDate" ? "active" : ""}`}
            onClick={() => changeSort("dueDate")}
          >
            Due Date
            {sortBy === "dueDate" &&
              (sortDirection === "asc" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              ))}
          </button>
          <button
            className={`btn-sort ${sortBy === "title" ? "active" : ""}`}
            onClick={() => changeSort("title")}
          >
            Title
            {sortBy === "title" &&
              (sortDirection === "asc" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              ))}
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="todos-container">
        {filteredAndSortedTodos().length === 0 ? (
          <div className="no-todos">
            <p>No tasks to display</p>
            {filter !== "all" && <p>Try changing your filter</p>}
          </div>
        ) : (
          <ul className="todo-list">
            {filteredAndSortedTodos().map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                {editingId === todo.id ? (
                  <form onSubmit={handleUpdateTodo} className="edit-form">
                    <div className="edit-form-content">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        required
                      />
                      <div className="date-input-wrapper">
                        <FaCalendarAlt className="date-icon" />
                        <input
                          type="date"
                          value={editForm.dueDate}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              dueDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="edit-buttons">
                        <button type="submit" className="btn btn-sm btn-save">
                          Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-cancel"
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="todo-checkbox">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() =>
                          handleToggleComplete(todo.id, todo.completed)
                        }
                        id={`todo-${todo.id}`}
                      />
                      <label
                        htmlFor={`todo-${todo.id}`}
                        className="todo-checkbox-label"
                      >
                        <FaCheck className="check-icon" />
                      </label>
                    </div>

                    <div className="todo-content">
                      <div className="todo-title">{todo.title}</div>
                      {todo.dueDate && (
                        <div className="todo-due-date">
                          <FaCalendarAlt /> Due:{" "}
                          {new Date(todo.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="todo-actions">
                      <button
                        className="btn-icon"
                        onClick={() => startEditing(todo)}
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteTodo(todo.id)}
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoList;
