import React from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="container">
        <div className="hero-content">
          <h1>Welcome to My Personal Assistant</h1>
          <p>Your all-in-one platform for managing tasks, expenses, and more</p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="/assets/images/hero-image.svg"
            alt="Personal Assistant Dashboard"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
