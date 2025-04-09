import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCamera,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const Profile = () => {
  const { currentUser, updateProfile, error } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: "",
    confirmPassword: "",
    avatar: currentUser?.avatar || "",
  });
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }

    if (formData.password && formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    // Only update what's changed
    const updates = {
      name: formData.name,
    };

    // Only include password if it was provided
    if (formData.password) {
      updates.password = formData.password;
    }

    try {
      updateProfile(updates);
      setSuccessMessage("Profile updated successfully");
      setIsEditing(false);

      // Clear password fields after successful update
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      setFormError(err.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormError(null);
    setSuccessMessage(null);

    // Reset form data to current user data
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      password: "",
      confirmPassword: "",
      avatar: currentUser?.avatar || "",
    });
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <p className="section-description">
        View and manage your account information
      </p>

      {error && <div className="alert alert-danger">{error}</div>}
      {formError && <div className="alert alert-danger">{formError}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <img
              src={currentUser?.avatar || "https://via.placeholder.com/150"}
              alt={currentUser?.name}
            />
            {isEditing && (
              <div className="avatar-overlay">
                <FaCamera className="camera-icon" />
                <span>Change Photo</span>
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2>{currentUser?.name}</h2>
            <p>{currentUser?.email}</p>
            {!isEditing && (
              <button
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="name">
                <FaUser className="form-icon" /> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="form-icon" /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                disabled
                className="disabled-input"
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <FaLock className="form-icon" /> New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock className="form-icon" /> Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                <FaSave /> Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-group">
              <span className="detail-label">Name</span>
              <span className="detail-value">{currentUser?.name}</span>
            </div>
            <div className="detail-group">
              <span className="detail-label">Email</span>
              <span className="detail-value">{currentUser?.email}</span>
            </div>
            <div className="detail-group">
              <span className="detail-label">Account Created</span>
              <span className="detail-value">April 1, 2025</span>
            </div>
          </div>
        )}
      </div>

      <div className="account-section">
        <h2>Account Settings</h2>
        <div className="settings-card">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Notifications</h3>
              <p>Manage your email notification preferences</p>
            </div>
            <div className="setting-action">
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Two-Factor Authentication</h3>
              <p>Add an extra layer of security to your account</p>
            </div>
            <div className="setting-action">
              <button className="btn btn-outline">Enable</button>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h3>Connected Accounts</h3>
              <p>Connect your account with other services</p>
            </div>
            <div className="setting-action">
              <button className="btn btn-outline">Connect</button>
            </div>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h2>Danger Zone</h2>
        <div className="danger-card">
          <div className="danger-item">
            <div className="danger-info">
              <h3>Delete Account</h3>
              <p>
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>
            <div className="danger-action">
              <button className="btn btn-danger">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
