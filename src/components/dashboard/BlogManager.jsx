import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchBlogsByAuthor,
  deleteBlog,
  updateBlogStatus,
} from "../../api/mockApi";
import "../../styles/BlogManager.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

const BlogManager = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'published', 'draft'
  const [sortBy, setSortBy] = useState("date"); // 'date', 'title'
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc', 'desc'
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogsByAuthor(currentUser.id);
        setBlogs(data);
      } catch (err) {
        setError("Failed to load blogs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, [currentUser.id]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      await updateBlogStatus(blogId, newStatus);

      // Update local state
      setBlogs(
        blogs.map((blog) =>
          blog.id === blogId ? { ...blog, status: newStatus } : blog
        )
      );
    } catch (err) {
      setError("Failed to update blog status");
      console.error(err);
    }
  };

  const handleDeleteClick = (blogId) => {
    setConfirmDelete(blogId);
  };

  const confirmDeleteBlog = async () => {
    if (!confirmDelete) return;

    try {
      await deleteBlog(confirmDelete);

      // Update local state
      setBlogs(blogs.filter((blog) => blog.id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      setError("Failed to delete blog");
      console.error(err);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
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

  // Filter and sort blogs
  const filteredAndSortedBlogs = () => {
    let result = [...blogs];

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((blog) => blog.status === filterStatus);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchLower) ||
          blog.excerpt.toLowerCase().includes(searchLower) ||
          blog.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortBy === "title") {
        return sortDirection === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });

    return result;
  };

  const getStatusClass = (status) => {
    return status === "published" ? "status-published" : "status-draft";
  };

  if (loading)
    return <div className="blog-manager-loading">Loading your blogs...</div>;

  return (
    <div className="blog-manager">
      <div className="blog-manager-header">
        <h1>Blog Manager</h1>
        <button
          className="btn btn-primary new-blog-btn"
          onClick={() => navigate("/dashboard/blog-editor")}
        >
          <FaPlus /> New Blog Post
        </button>
      </div>

      {error && <div className="blog-manager-error">{error}</div>}

      <div className="blog-controls">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search blogs..."
          />
        </div>

        <div className="filter-controls">
          <div className="filter-by-status">
            <label>
              <FaFilter /> Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
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
              className={`btn-sort ${sortBy === "title" ? "active" : ""}`}
              onClick={() => changeSort("title")}
            >
              Title
              {sortBy === "title" &&
                (sortDirection === "asc" ? (
                  <FaSortAmountUp />
                ) : (
                  <FaSortAmountDown />
                ))}
            </button>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="delete-confirmation">
          <p>
            Are you sure you want to delete this blog post? This action cannot
            be undone.
          </p>
          <div className="confirmation-buttons">
            <button className="btn btn-secondary" onClick={cancelDelete}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDeleteBlog}>
              Delete
            </button>
          </div>
        </div>
      )}

      {filteredAndSortedBlogs().length === 0 ? (
        <div className="no-blogs">
          <p>No blog posts found.</p>
          {searchTerm && <p>Try adjusting your search or filters.</p>}
          {!blogs.length && (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/dashboard/blog-editor")}
            >
              Create Your First Blog Post
            </button>
          )}
        </div>
      ) : (
        <div className="blog-table-container">
          <table className="blog-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBlogs().map((blog) => (
                <tr key={blog.id}>
                  <td className="blog-title-cell">
                    <div className="blog-info">
                      {blog.coverImage && (
                        <div className="blog-thumbnail">
                          <img src={blog.coverImage} alt={blog.title} />
                        </div>
                      )}
                      <div>
                        <h3>{blog.title}</h3>
                        <p className="blog-excerpt">
                          {blog.excerpt.substring(0, 100)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${getStatusClass(blog.status)}`}
                    >
                      {blog.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td>{blog.category}</td>
                  <td>
                    {new Date(
                      blog.updatedAt || blog.createdAt
                    ).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="blog-actions">
                      <Link
                        to={`/dashboard/blog-editor/${blog.id}`}
                        className="action-btn edit-btn"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="action-btn view-btn"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <button
                        className="action-btn status-btn"
                        title={
                          blog.status === "published" ? "Unpublish" : "Publish"
                        }
                        onClick={() =>
                          handleStatusChange(
                            blog.id,
                            blog.status === "published" ? "draft" : "published"
                          )
                        }
                      >
                        {blog.status === "published" ? (
                          <FaEyeSlash />
                        ) : (
                          <FaEye />
                        )}
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete"
                        onClick={() => handleDeleteClick(blog.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
