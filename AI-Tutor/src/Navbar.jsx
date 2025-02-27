import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa"; // Ensure react-icons is installed
import "./Navbar.css";

const studentData = {
  name: "Arpit Singh",
  id: "12345",
  subjects: [
    { name: "Math", marks: 90 },
    { name: "Science", marks: 85 },
    { name: "English", marks: 88 },
  ],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState({ Math: null, Science: null, English: null });

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleImageUpload = (event, subject) => {
    const file = event.target.files[0];
    if (file) {
      setImages((prevImages) => ({ ...prevImages, [subject]: URL.createObjectURL(file) }));
    }
  };

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">Student Portal</h1>
        <div className="navbar-options">
          {/* ✅ Profile Dropdown */}
          <div className="profile-dropdown">
            <button onClick={() => setOpen(!open)} className="profile-button">
              <FaUserCircle size={20} /> Profile ▼
            </button>
            {open && (
              <div className="dropdown-content">
                <div className="dropdown-header">{studentData.name}</div>
                <div className="dropdown-item">Student ID: {studentData.id}</div>
                <hr />
                {studentData.subjects.map((subject, index) => (
                  <div key={index} className="dropdown-item">{subject.name}: {subject.marks}</div>
                ))}
              </div>
            )}
          </div>
          <button className="logout-button">Logout</button>
        </div>
      </nav>

      {/* ✅ Main Content */}
      <div className="content">
        <h2 className="welcome-text">Welcome to the Student Portal</h2>
        <div className="subject-sections">
          {studentData.subjects.map((subject, index) => (
            <div key={index} className="subject-card">
              <h3>{subject.name}</h3>
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, subject.name)} />
              {images[subject.name] && (
                <img src={images[subject.name]} alt={`${subject.name} upload`} className="uploaded-image" />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
