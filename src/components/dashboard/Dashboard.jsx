import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchDashboardStats } from "../../api/mockApi";

// Import icons
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaListAlt,
  FaChartPie,
  FaCalendarAlt,
} from "react-icons/fa";

// Import chart components
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchDashboardStats(currentUser.id);
        setStats(data);
      } catch (err) {
        setError("Error loading dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser.id]);

  if (loading) return <div className="loading">Loading dashboard data...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>
      <p className="welcome-message">
        Welcome back, {currentUser.name}! Here's your overview.
      </p>

      <div className="dashboard-grid">
        {/* Todo Statistics */}
        <div className="dashboard-card todo-stats">
          <div className="card-header">
            <h2>
              <FaListAlt /> Todo Overview
            </h2>
            <Link to="/dashboard/todo" className="card-link">
              View All
            </Link>
          </div>
          <div className="card-content">
            <div className="stat-items">
              <div className="stat-item">
                <span className="stat-number">{stats.todoStats.total}</span>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.todoStats.completed}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{stats.todoStats.pending}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: stats.todoStats.completed },
                      { name: "Pending", value: stats.todoStats.pending },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#00C49F" />
                    <Cell fill="#FFBB28" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card-footer">
            <div className="completion-rate">
              <div className="completion-label">Completion Rate:</div>
              <div className="completion-bar">
                <div
                  className="completion-progress"
                  style={{
                    width: `${
                      stats.todoStats.total
                        ? (stats.todoStats.completed / stats.todoStats.total) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="completion-percentage">
                {stats.todoStats.total
                  ? Math.round(
                      (stats.todoStats.completed / stats.todoStats.total) * 100
                    )
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>

        {/* Expense Statistics */}
        <div className="dashboard-card expense-stats">
          <div className="card-header">
            <h2>
              <FaChartPie /> Expense Overview
            </h2>
            <Link to="/dashboard/expenses" className="card-link">
              View All
            </Link>
          </div>
          <div className="card-content">
            <div className="stat-items">
              <div className="stat-item main-stat">
                <span className="stat-number">
                  ${stats.expenseStats.total.toFixed(2)}
                </span>
                <span className="stat-label">Total Expenses</span>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.expenseStats.categories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8">
                    {stats.expenseStats.categories.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card-footer">
            <div className="expense-category-list">
              {stats.expenseStats.categories.map((category, index) => (
                <div className="expense-category-item" key={index}>
                  <div
                    className="category-color"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="category-name">{category.category}</div>
                  <div className="category-amount">
                    ${category.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <div className="card-header">
            <h2>
              <FaCalendarAlt /> Recent Activity
            </h2>
          </div>
          <div className="card-content">
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon completed">
                  <FaCheckCircle />
                </div>
                <div className="activity-details">
                  <div className="activity-title">
                    Completed task: Learn React hooks
                  </div>
                  <div className="activity-time">Today, 9:30 AM</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon pending">
                  <FaHourglassHalf />
                </div>
                <div className="activity-details">
                  <div className="activity-title">
                    Added task: Complete portfolio website
                  </div>
                  <div className="activity-time">Yesterday, 2:15 PM</div>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon expense">
                  <FaChartPie />
                </div>
                <div className="activity-details">
                  <div className="activity-title">
                    Added expense: Office supplies - $25.75
                  </div>
                  <div className="activity-time">Apr 5, 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
