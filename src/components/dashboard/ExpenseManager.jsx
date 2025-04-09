import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../api/mockApi";

// Import icons
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaDollarSign,
  FaTags,
  FaSortAmountDown,
  FaSortAmountUp,
  FaFilter,
  FaChartPie,
} from "react-icons/fa";

// Import chart components
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const ExpenseManager = () => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New expense form state
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    date: "",
    category: "Other",
  });

  // Edit mode state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
  });

  // Filters and sorting state
  const [filter, setFilter] = useState("all"); // 'all', category names
  const [sortBy, setSortBy] = useState("date"); // 'date', 'amount', 'description'
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc', 'desc'

  // Chart display
  const [chartType, setChartType] = useState("pie"); // 'pie', 'bar'

  // Categories (could come from backend)
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

  // Chart colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#f28e2c",
    "#e15759",
    "#59a14f",
  ];

  useEffect(() => {
    loadExpenses();
  }, [currentUser.id]);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await fetchExpenses(currentUser.id);
      setExpenses(data);
    } catch (err) {
      setError("Error loading expenses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!newExpense.description.trim() || !newExpense.amount) return;

    try {
      const expense = await addExpense(currentUser.id, {
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      });
      setExpenses([...expenses, expense]);
      setNewExpense({
        description: "",
        amount: "",
        date: "",
        category: "Other",
      }); // Reset form
    } catch (err) {
      setError("Error adding expense");
      console.error(err);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      setExpenses(expenses.filter((expense) => expense.id !== expenseId));
    } catch (err) {
      setError("Error deleting expense");
      console.error(err);
    }
  };

  const startEditing = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({ description: "", amount: "", date: "", category: "" });
  };

  const handleUpdateExpense = async (e) => {
    e.preventDefault();

    if (!editForm.description.trim() || !editForm.amount) return;

    try {
      const updatedExpense = await updateExpense(editingId, {
        ...editForm,
        amount: parseFloat(editForm.amount),
      });
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingId ? updatedExpense : expense
        )
      );
      setEditingId(null);
    } catch (err) {
      setError("Error updating expense");
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
      setSortDirection("desc");
    }
  };

  // Filter and sort expenses
  const filteredAndSortedExpenses = () => {
    let result = [...expenses];

    // Apply category filter
    if (filter !== "all") {
      result = result.filter((expense) => expense.category === filter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "amount") {
        return sortDirection === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      } else if (sortBy === "description") {
        return sortDirection === "asc"
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      return 0;
    });

    return result;
  };

  // Get expense statistics
  const getExpenseStats = () => {
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

  if (loading && expenses.length === 0)
    return <div className="loading">Loading expenses...</div>;

  const stats = getExpenseStats();

  return (
    <div className="expense-manager-page">
      <h1>Expense Manager</h1>

      {error && <div className="error-message">{error}</div>}

      {/* Summary Stats */}
      <div className="summary-card">
        <div className="summary-amount">
          <span className="amount-label">Total Expenses</span>
          <span className="amount-value">${stats.total.toFixed(2)}</span>
        </div>

        <div className="chart-toggle">
          <button
            className={`btn-chart ${chartType === "pie" ? "active" : ""}`}
            onClick={() => setChartType("pie")}
          >
            Pie Chart
          </button>
          <button
            className={`btn-chart ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
          >
            Bar Chart
          </button>
        </div>

        <div className="expense-chart">
          <ResponsiveContainer width="100%" height={250}>
            {chartType === "pie" ? (
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  nameKey="category"
                  label={({ category, percentage }) =>
                    `${category}: ${percentage}%`
                  }
                >
                  {stats.chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            ) : (
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
                <Bar dataKey="amount" fill="#8884d8">
                  {stats.chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className="expense-form-card">
        <h2>Add New Expense</h2>
        <form onSubmit={handleAddExpense} className="expense-form">
          <div className="form-row">
            <div className="form-group">
              <div className="input-icon-wrapper">
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({
                      ...newExpense,
                      description: e.target.value,
                    })
                  }
                  placeholder="Description"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaDollarSign className="input-icon" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  placeholder="Amount"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaCalendarAlt className="input-icon" />
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, date: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-icon-wrapper">
                <FaTags className="input-icon" />
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-primary">
                <FaPlus /> Add Expense
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filters and Sort Controls */}
      <div className="expense-controls">
        <div className="filter-dropdown">
          <label>
            <FaFilter /> Category:
          </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <button
            className={`btn-sort ${sortBy === "date" ? "active" : ""}`}
            onClick={() => changeSort("date")}
          >
            Date
            {sortBy === "date" &&
              (sortDirection === "asc" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              ))}
          </button>
          <button
            className={`btn-sort ${sortBy === "amount" ? "active" : ""}`}
            onClick={() => changeSort("amount")}
          >
            Amount
            {sortBy === "amount" &&
              (sortDirection === "asc" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              ))}
          </button>
          <button
            className={`btn-sort ${sortBy === "description" ? "active" : ""}`}
            onClick={() => changeSort("description")}
          >
            Description
            {sortBy === "description" &&
              (sortDirection === "asc" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              ))}
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="expenses-container">
        {filteredAndSortedExpenses().length === 0 ? (
          <div className="no-expenses">
            <p>No expenses to display</p>
            {filter !== "all" && <p>Try changing your filter</p>}
          </div>
        ) : (
          <ul className="expense-list">
            {filteredAndSortedExpenses().map((expense) => (
              <li key={expense.id} className="expense-item">
                {editingId === expense.id ? (
                  <form onSubmit={handleUpdateExpense} className="edit-form">
                    <div className="edit-form-content">
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                      <div className="amount-input">
                        <FaDollarSign className="amount-icon" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={editForm.amount}
                          onChange={(e) =>
                            setEditForm({ ...editForm, amount: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="date-input-wrapper">
                        <FaCalendarAlt className="date-icon" />
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) =>
                            setEditForm({ ...editForm, date: e.target.value })
                          }
                          required
                        />
                      </div>
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                        required
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      <div className="edit-buttons">
                        <button type="submit" className="btn btn-sm btn-save">
                          <FaSave /> Save
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-cancel"
                          onClick={cancelEditing}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <div
                      className="expense-category"
                      style={{
                        backgroundColor:
                          COLORS[
                            categories.indexOf(expense.category) % COLORS.length
                          ],
                      }}
                    >
                      {expense.category}
                    </div>

                    <div className="expense-content">
                      <div className="expense-description">
                        {expense.description}
                      </div>
                      <div className="expense-date">
                        <FaCalendarAlt />{" "}
                        {new Date(expense.date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="expense-amount">
                      ${expense.amount.toFixed(2)}
                    </div>

                    <div className="expense-actions">
                      <button
                        className="btn-icon"
                        onClick={() => startEditing(expense)}
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteExpense(expense.id)}
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

export default ExpenseManager;
