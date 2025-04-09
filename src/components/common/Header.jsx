import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header>
      <div className="navbar">
        <Link to="/" className="navbar-brand">
          Personal Assistant
        </Link>

        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`navbar-nav ${mobileMenuOpen ? "active" : ""}`}>
          <ul>
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <a
                href="#about"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#portfolio"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Portfolio
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#contact"
                className="nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </li>

            {currentUser ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <div className="dropdown">
                    <button className="dropdown-toggle">
                      <img
                        src={
                          currentUser.avatar || "https://via.placeholder.com/30"
                        }
                        alt={currentUser.name}
                        className="nav-avatar"
                      />
                      <span>{currentUser.name}</span>
                    </button>
                    <div className="dropdown-menu">
                      <NavLink
                        to="/dashboard/profile"
                        className="dropdown-item"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FaUser /> Profile
                      </NavLink>
                      <button onClick={handleLogout} className="dropdown-item">
                        Logout
                      </button>
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <li className="nav-item auth-links">
                <Link
                  to="/login"
                  className="btn btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
