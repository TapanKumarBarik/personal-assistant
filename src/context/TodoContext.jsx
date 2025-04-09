import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "../api/mockApi";

const TodoContext = createContext();

export const useTodo = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      loadTodos();
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [currentUser]);

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTodos(currentUser.id);
      setTodos(data);
    } catch (err) {
      setError("Failed to load todos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTodo = async (todoData) => {
    setError(null);
    try {
      const newTodo = await addTodo(currentUser.id, todoData);
      setTodos([...todos, newTodo]);
      return newTodo;
    } catch (err) {
      setError("Failed to create todo");
      console.error(err);
      throw err;
    }
  };

  const editTodo = async (todoId, updates) => {
    setError(null);
    try {
      const updatedTodo = await updateTodo(todoId, updates);
      setTodos(todos.map((todo) => (todo.id === todoId ? updatedTodo : todo)));
      return updatedTodo;
    } catch (err) {
      setError("Failed to update todo");
      console.error(err);
      throw err;
    }
  };

  const removeTodo = async (todoId) => {
    setError(null);
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter((todo) => todo.id !== todoId));
      return { success: true };
    } catch (err) {
      setError("Failed to delete todo");
      console.error(err);
      throw err;
    }
  };

  const toggleComplete = async (todoId) => {
    const todo = todos.find((t) => t.id === todoId);
    if (!todo) return;

    return await editTodo(todoId, { completed: !todo.completed });
  };

  // Statistics and filters
  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;

    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const filterTodos = (filterType) => {
    switch (filterType) {
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "active":
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  };

  const sortTodos = (todoList, sortBy, direction) => {
    return [...todoList].sort((a, b) => {
      if (sortBy === "dueDate") {
        const dateA = new Date(a.dueDate || "9999-12-31");
        const dateB = new Date(b.dueDate || "9999-12-31");
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "title") {
        return direction === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });
  };

  const value = {
    todos,
    loading,
    error,
    createTodo,
    editTodo,
    removeTodo,
    toggleComplete,
    getStats,
    filterTodos,
    sortTodos,
    refresh: loadTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export default TodoContext;
