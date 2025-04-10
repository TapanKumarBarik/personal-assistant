import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchBlogs } from "../../api/mockApi";
import "../../styles/Blog.css";
import { FaCalendarAlt, FaUser, FaTag, FaClock } from "react-icons/fa";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // 'all', or category name

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (err) {
        setError("Failed to load blogs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  // Get all unique categories
  const categories = ["all", ...new Set(blogs.map((blog) => blog.category))];

  // Filter blogs by category
  const filteredBlogs =
    filter === "all" ? blogs : blogs.filter((blog) => blog.category === filter);

  // Calculate estimated reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (loading) return <div className="blog-loading">Loading blogs...</div>;
  if (error) return <div className="blog-error">{error}</div>;

  return (
    <div className="blog-page">
      <div className="blog-hero">
        <div className="container">
          <h1>Blog</h1>
          <p>Thoughts, stories and ideas</p>
        </div>
      </div>

      <div className="container blog-container">
        <div className="blog-sidebar">
          <div className="blog-categories">
            <h3>Categories</h3>
            <ul>
              {categories.map((category, index) => (
                <li key={index}>
                  <button
                    className={`category-btn ${
                      filter === category ? "active" : ""
                    }`}
                    onClick={() => setFilter(category)}
                  >
                    {category === "all" ? "All Posts" : category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="blog-recent">
            <h3>Recent Posts</h3>
            <ul>
              {blogs.slice(0, 3).map((blog) => (
                <li key={blog.id}>
                  <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="blog-content">
          {filteredBlogs.length === 0 ? (
            <div className="no-blogs">
              <p>No blog posts found.</p>
            </div>
          ) : (
            <div className="blog-grid">
              {filteredBlogs.map((blog) => (
                <div className="blog-card" key={blog.id}>
                  <div className="blog-image">
                    <img
                      src={
                        blog.coverImage || "https://via.placeholder.com/400x200"
                      }
                      alt={blog.title}
                    />
                    <div className="blog-category">{blog.category}</div>
                  </div>
                  <div className="blog-card-content">
                    <h2 className="blog-title">
                      <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
                    </h2>
                    <div className="blog-meta">
                      <span className="blog-date">
                        <FaCalendarAlt />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                      <span className="blog-author">
                        <FaUser />
                        {blog.author}
                      </span>
                      <span className="blog-reading-time">
                        <FaClock />
                        {getReadingTime(blog.content)} min read
                      </span>
                    </div>
                    <p className="blog-excerpt">{blog.excerpt}</p>
                    <Link to={`/blog/${blog.id}`} className="read-more">
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
