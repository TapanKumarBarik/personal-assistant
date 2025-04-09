// About.jsx
import React from "react";

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-content">
          <div className="about-image">
            <img src="/assets/images/profile.jpg" alt="Profile" />
          </div>
          <div className="about-text">
            <p>
              Hello! I'm a passionate developer with expertise in modern web
              technologies. I specialize in building responsive and
              user-friendly applications using React, Node.js, and other
              cutting-edge tools.
            </p>
            <p>
              This personal assistant site showcases my skills and provides
              useful tools for daily life management. Feel free to explore my
              projects and get in touch!
            </p>
            <div className="skills">
              <span className="skill-tag">React</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Azure</span>
              <span className="skill-tag">UI/UX Design</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
