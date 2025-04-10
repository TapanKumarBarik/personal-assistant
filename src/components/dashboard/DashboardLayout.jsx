import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Import icons
import {
  FaTachometerAlt,
  FaUser,
  FaCheckSquare,
  FaWallet,
  FaBlog,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2>Personal Assistant</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <div className="user-info">
          <img
            src={currentUser?.avatar || "https://via.placeholder.com/50"}
            alt={currentUser?.name || "User"}
            className="avatar"
          />
          <span className="user-name">{currentUser?.name || "User"}</span>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaUser />
                <span>Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/todo"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaCheckSquare />
                <span>Todo List</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/expenses"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaWallet />
                <span>Expense Manager</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dashboard/blog-manager"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <FaBlog />
                <span>Blog Manager</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
        <header className="dashboard-header">
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h1>Welcome, {currentUser?.name || "User"}!</h1>
          <div className="header-actions">
            <NavLink to="/dashboard/profile" className="profile-link">
              <img
                src={currentUser?.avatar || "https://via.placeholder.com/35"}
                alt={currentUser?.name || "User"}
                className="header-avatar"
              />
            </NavLink>
          </div>
        </header>

        <div className="content-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
