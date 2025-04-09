import React from "react";
import { Link } from "react-router-dom";
import { FaLinkedin, FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>Personal Assistant</h3>
            <p>
              Your all-in-one platform for managing tasks, expenses, and more
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" className="social-link" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a
                href="mailto:email@example.com"
                className="social-link"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>

          <div className="footer-links-container">
            <div className="footer-links-column">
              <h4>Site Map</h4>
              <ul className="footer-links">
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#about">About</a>
                </li>
                <li>
                  <a href="#portfolio">Portfolio</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Features</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/dashboard/todo">Todo List</Link>
                </li>
                <li>
                  <Link to="/dashboard/expenses">Expense Manager</Link>
                </li>
                <li>
                  <Link to="/dashboard/profile">Profile</Link>
                </li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Legal</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/cookies">Cookies Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {currentYear} Personal Assistant. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
