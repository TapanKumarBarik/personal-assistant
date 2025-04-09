import React from "react";
import { Link } from "react-router-dom";

const Portfolio = () => {
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution with React and Node.js",
      image: "/assets/images/project1.jpg",
      link: "#",
    },
    {
      id: 2,
      title: "Weather App",
      description: "A responsive weather application using OpenWeather API",
      image: "/assets/images/project2.jpg",
      link: "#",
    },
    {
      id: 3,
      title: "Task Management System",
      description: "A robust task management tool for teams",
      image: "/assets/images/project3.jpg",
      link: "#",
    },
  ];

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container">
        <h2>My Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <Link to={project.link} className="btn btn-sm">
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="view-more">
          <Link to="/projects" className="btn btn-outline">
            View More Projects
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
