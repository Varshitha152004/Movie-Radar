import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import "../styles/Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    gender: "",
    dob: "",
    profilePic: localStorage.getItem("profilePic") || "https://via.placeholder.com/150",
  });

  const [editable, setEditable] = useState({
    username: false,
    phone: false,
    password: false,
    gender: false,
    dob: false,
  });

  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isLoggedIn");
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!isAuthenticated || !storedUser) {
      navigate("/login");
    } else {
      setUser((prevUser) => ({ ...prevUser, ...storedUser }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(user));
    navigate("/");
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser((prevUser) => ({
          ...prevUser,
          profilePic: event.target.result,
        }));
        localStorage.setItem("profilePic", event.target.result);
      };
      reader.readAsDataURL(file);
    }
    setShowOptions(false);
  };

  const handleRemovePicture = () => {
    setUser((prevUser) => ({ ...prevUser, profilePic: "" }));
    localStorage.removeItem("profilePic");
    setShowOptions(false);
  };

  const toggleEditable = (field) => {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h2 className="profile-title">My Profile</h2>

        <div className="profile-content">
          <div className="profile-picture-container">
            <img className="profile-img" src={user.profilePic || "https://via.placeholder.com/150"} alt="Profile" />
          </div>

          <button className="change-pic-btn" onClick={() => setShowOptions(!showOptions)}>
            Change Picture
          </button>

          {showOptions && (
            <div className="profile-options">
              <button onClick={handleRemovePicture} className="option-btn">None</button>
              <label className="option-btn">
                Choose from Gallery
                <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
              </label>
            </div>
          )}

          <div className="profile-info">
            <label>Username:</label>
            <div className="editable-field">
              <input type="text" name="username" value={user.username} onChange={handleChange} disabled={!editable.username} />
              <FaEdit className="edit-icon" onClick={() => toggleEditable("username")} />
            </div>

            <label>Email:</label>
            <div className="readonly-field">
              <input type="email" name="email" value={user.email} disabled />
            </div>

            <label>Phone:</label>
            <div className="editable-field">
              <input type="text" name="phone" value={user.phone} onChange={handleChange} disabled={!editable.phone} />
              <FaEdit className="edit-icon" onClick={() => toggleEditable("phone")} />
            </div>

            <label>Password:</label>
            <div className="editable-field">
              <input type="password" name="password" value={user.password} onChange={handleChange} disabled={!editable.password} />
              <FaEdit className="edit-icon" onClick={() => toggleEditable("password")} />
            </div>

            <label>Gender:</label>
            <div className="editable-field">
              <select name="gender" value={user.gender} onChange={handleChange} disabled={!editable.gender}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <FaEdit className="edit-icon" onClick={() => toggleEditable("gender")} />
            </div>

            <label>Date of Birth:</label>
            <div className="editable-field">
              <input type="date" name="dob" value={user.dob} onChange={handleChange} disabled={!editable.dob} />
              <FaEdit className="edit-icon" onClick={() => toggleEditable("dob")} />
            </div>

            <div className="profile-buttons">
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="back-btn" onClick={() => navigate("/")}>Back to Home</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
