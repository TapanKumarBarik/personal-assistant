import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBlogById, createBlog, updateBlog } from "../../api/mockApi";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../styles/BlogEditor.css";
import {
  FaSave,
  FaTimes,
  FaCamera,
  FaCode,
  FaHeading,
  FaImage,
  FaParagraph,
  FaListUl,
  FaQuoteLeft,
} from "react-icons/fa";

const BlogEditor = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // For editing existing blog
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "Technology",
    tags: "",
    coverImage: "",
    status: "draft", // 'draft' or 'published'
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Available categories
  const categories = [
    "Technology",
    "Programming",
    "Design",
    "Business",
    "Productivity",
    "Personal",
    "Other",
  ];

  // Load blog data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadBlog = async () => {
        try {
          setLoading(true);
          const data = await fetchBlogById(parseInt(id));

          // Convert HTML content to Draft.js EditorState
          const contentBlock = htmlToDraft(data.content);
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
          }

          setFormData({
            title: data.title,
            excerpt: data.excerpt,
            category: data.category,
            tags: data.tags.join(", "),
            coverImage: data.coverImage,
            status: data.status,
          });

          setPreviewImage(data.coverImage);
        } catch (err) {
          setError("Failed to load blog post for editing");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      loadBlog();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditorStateChange = (state) => {
    setEditorState(state);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, upload the file to a server
      // Here we create a local Object URL for preview purposes
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData((prevData) => ({ ...prevData, coverImage: imageUrl }));
    }
  };

  const validateForm = (data) => {
    if (!data.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!data.excerpt.trim()) {
      setError("Excerpt is required");
      return false;
    }
    // Check if editor content is empty
    const contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      setError("Content is required");
      return false;
    }
    return true;
  };

  // A new function that builds the blog data object and handles the submit process.
  const submitBlog = async (status) => {
    // Convert Draft.js content to HTML
    const contentState = editorState.getCurrentContent();
    const contentHtml = draftToHtml(convertToRaw(contentState));

    // Build the blog data with the required status
    const blogData = {
      ...formData,
      content: contentHtml,
      status,
    };

    // Validate using the constructed data
    if (!validateForm(blogData)) return;

    try {
      setLoading(true);
      setError(null);

      // Prepare the blog data with additional fields
      const preparedBlogData = {
        ...blogData,
        author: currentUser.name,
        tags: blogData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        updatedAt: new Date().toISOString(),
        authorId: currentUser.id,
      };

      if (isEditMode) {
        await updateBlog(parseInt(id), preparedBlogData);
        setSuccessMessage("Blog post updated successfully");
      } else {
        await createBlog({
          ...preparedBlogData,
          createdAt: new Date().toISOString(),
        });
        setSuccessMessage("Blog post created successfully");

        // Redirect to the blog manager after a short delay
        setTimeout(() => {
          navigate(`/dashboard/blog-manager`);
        }, 1500);
      }
    } catch (err) {
      setError(
        isEditMode ? "Failed to update blog post" : "Failed to create blog post"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    await submitBlog("draft");
  };

  const handlePublish = async () => {
    await submitBlog("published");
  };

  const handleCancel = () => {
    navigate("/dashboard/blog-manager");
  };

  if (loading && isEditMode)
    return <div className="blog-editor-loading">Loading blog data...</div>;

  return (
    <div className="blog-editor">
      <div className="blog-editor-header">
        <h1>{isEditMode ? "Edit Blog Post" : "Create New Blog Post"}</h1>
        <div className="blog-editor-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            <FaSave /> Save Draft
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handlePublish}
            disabled={loading}
          >
            Publish
          </button>
        </div>
      </div>

      {error && <div className="blog-editor-error">{error}</div>}
      {successMessage && (
        <div className="blog-editor-success">{successMessage}</div>
      )}

      <form className="blog-editor-form">
        <div className="form-row">
          <div className="form-group blog-title-group">
            <label htmlFor="title">Blog Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title"
              required
            />
          </div>

          <div className="form-group blog-category-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Write a brief summary of your blog post"
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group blog-cover-image">
          <label>Cover Image</label>
          <div className="cover-image-container">
            {previewImage ? (
              <div className="image-preview">
                <img src={previewImage} alt="Cover preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setPreviewImage(null);
                    setFormData((prevData) => ({
                      ...prevData,
                      coverImage: "",
                    }));
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <FaCamera className="upload-icon" />
                <p>Upload a cover image</p>
                <span>Recommended size: 1200 x 600 pixels</span>
              </div>
            )}
            <input
              type="file"
              id="coverImage"
              accept="image/*"
              onChange={handleCoverImageChange}
              className="file-input"
            />
            <label htmlFor="coverImage" className="file-input-label">
              Choose Image
            </label>
          </div>
        </div>

        <div className="form-group blog-content-editor">
          <label>Content</label>
          <div className="editor-help">
            <div className="editor-help-item">
              <FaHeading /> Use headings for sections
            </div>
            <div className="editor-help-item">
              <FaParagraph /> Structure with paragraphs
            </div>
            <div className="editor-help-item">
              <FaImage /> Add images for visual interest
            </div>
            <div className="editor-help-item">
              <FaCode /> Include code examples
            </div>
            <div className="editor-help-item">
              <FaListUl /> Use lists to organize points
            </div>
            <div className="editor-help-item">
              <FaQuoteLeft /> Add quotes for emphasis
            </div>
          </div>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorStateChange}
            wrapperClassName="editor-wrapper"
            editorClassName="editor-content"
            toolbarClassName="editor-toolbar"
            toolbar={{
              options: [
                "inline",
                "blockType",
                "fontSize",
                "list",
                "textAlign",
                "colorPicker",
                "link",
                "embedded",
                "emoji",
                "image",
                "remove",
                "history",
              ],
              inline: {
                options: [
                  "bold",
                  "italic",
                  "underline",
                  "strikethrough",
                  "monospace",
                  "superscript",
                  "subscript",
                ],
              },
              blockType: {
                options: [
                  "Normal",
                  "H1",
                  "H2",
                  "H3",
                  "H4",
                  "H5",
                  "H6",
                  "Blockquote",
                  "Code",
                ],
              },
              list: {
                options: ["unordered", "ordered", "indent", "outdent"],
              },
            }}
            placeholder="Write your blog post here..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas (e.g. react, javascript, web development)"
          />
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;
