import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchBlogById } from "../../api/mockApi";
import "../../styles/Blog.css";
import {
  FaCalendarAlt,
  FaUser,
  FaTag,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogById(parseInt(id));
        setBlog(data);
      } catch (err) {
        setError("Failed to load blog post");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [id]);

  // Calculate estimated reading time
  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  if (loading) return <div className="blog-loading">Loading blog post...</div>;
  if (error) return <div className="blog-error">{error}</div>;
  if (!blog) return <div className="blog-error">Blog post not found</div>;

  return (
    <div className="blog-detail-page">
      <div
        className="blog-detail-hero"
        style={{
          backgroundImage: `url(${
            blog.coverImage || "https://via.placeholder.com/1200x600"
          })`,
        }}
      >
        <div className="container">
          <div className="blog-detail-hero-content">
            <div className="blog-category">{blog.category}</div>
            <h1>{blog.title}</h1>
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
          </div>
        </div>
      </div>

      <div className="container blog-detail-container">
        <button className="back-button" onClick={() => navigate("/blog")}>
          <FaArrowLeft /> Back to Blog
        </button>

        <div className="blog-detail-content">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        <div className="blog-detail-footer">
          <div className="blog-tags">
            {blog.tags.map((tag, index) => (
              <span key={index} className="blog-tag">
                <FaTag /> {tag}
              </span>
            ))}
          </div>

          <div className="blog-share">
            <h3>Share this post</h3>
            <div className="social-share-buttons">
              {/* These would link to actual share URLs in a real implementation */}
              <button className="share-button facebook">Facebook</button>
              <button className="share-button twitter">Twitter</button>
              <button className="share-button linkedin">LinkedIn</button>
            </div>
          </div>
        </div>

        {blog.relatedPosts && blog.relatedPosts.length > 0 && (
          <div className="related-posts">
            <h2>You might also like</h2>
            <div className="related-posts-grid">
              {blog.relatedPosts.map((post) => (
                <div className="related-post-card" key={post.id}>
                  <div className="related-post-image">
                    <img
                      src={
                        post.coverImage || "https://via.placeholder.com/300x200"
                      }
                      alt={post.title}
                    />
                  </div>
                  <h3 className="related-post-title">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h3>
                  <div className="related-post-date">
                    <FaCalendarAlt />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
