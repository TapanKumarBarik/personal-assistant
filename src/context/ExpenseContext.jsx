import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext";
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../api/mockApi";

const ExpenseContext = createContext();

export const useExpense = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Available categories
  const categories = [
    "Food",
    "Transportation",
    "Housing",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Shopping",
    "Business",
    "Other",
  ];

  useEffect(() => {
    if (currentUser) {
      loadExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [currentUser]);

  const loadExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExpenses(currentUser.id);
      setExpenses(data);
    } catch (err) {
      setError("Failed to load expenses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (expenseData) => {
    setError(null);
    try {
      const newExpense = await addExpense(currentUser.id, {
        ...expenseData,
        amount: parseFloat(expenseData.amount),
      });
      setExpenses([...expenses, newExpense]);
      return newExpense;
    } catch (err) {
      setError("Failed to create expense");
      console.error(err);
      throw err;
    }
  };

  const editExpense = async (expenseId, updates) => {
    setError(null);
    try {
      const updatedExpense = await updateExpense(expenseId, {
        ...updates,
        amount: updates.amount ? parseFloat(updates.amount) : undefined,
      });
      setExpenses(
        expenses.map((expense) =>
          expense.id === expenseId ? updatedExpense : expense
        )
      );
      return updatedExpense;
    } catch (err) {
      setError("Failed to update expense");
      console.error(err);
      throw err;
    }
  };

  const removeExpense = async (expenseId) => {
    setError(null);
    try {
      await deleteExpense(expenseId);
      setExpenses(expenses.filter((expense) => expense.id !== expenseId));
      return { success: true };
    } catch (err) {
      setError("Failed to delete expense");
      console.error(err);
      throw err;
    }
  };

  // Statistics and filters
  const getStats = () => {
    // Total amount
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Expenses by category
    const byCategory = categories
      .map((category) => {
        const categoryExpenses = expenses.filter(
          (expense) => expense.category === category
        );
        const amount = categoryExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );
        return {
          category,
          amount,
          percentage: total ? ((amount / total) * 100).toFixed(1) : 0,
        };
      })
      .filter((cat) => cat.amount > 0);

    return {
      total,
      byCategory,
      // For charts
      chartData:
        byCategory.length > 0
          ? byCategory
          : [{ category: "No Data", amount: 1 }],
    };
  };

  const filterExpenses = (filterCategory) => {
    if (filterCategory === "all") {
      return expenses;
    }
    return expenses.filter((expense) => expense.category === filterCategory);
  };

  const sortExpenses = (expenseList, sortBy, direction) => {
    return [...expenseList].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return direction === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "amount") {
        return direction === "asc" ? a.amount - b.amount : b.amount - a.amount;
      } else if (sortBy === "description") {
        return direction === "asc"
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      return 0;
    });
  };

  const value = {
    expenses,
    categories,
    loading,
    error,
    createExpense,
    editExpense,
    removeExpense,
    getStats,
    filterExpenses,
    sortExpenses,
    refresh: loadExpenses,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export default ExpenseContext;
