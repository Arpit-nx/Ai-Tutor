import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing
import { FaUserCircle } from "react-icons/fa"; // Ensure react-icons is installed
import "./Navbar.css";

const studentData = {
  name: "Arpit Singh",
  id: "12345",
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate(); // Hook to navigate between pages

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
                {/* ✅ Upload Button - Navigates to /fileUpload */}
                <button className="upload-button" onClick={() => navigate("/fileUpload")}>
                  Upload
                </button>
                {/* ✅ Report Button - Navigates to /showReport */}
                <button className="upload-button" style={{ marginTop: "10px" }} onClick={() => navigate("/showReport")}>
                  Report
                </button>
              </div>
            )}
          </div>
          <button className="logout-button">Logout</button>
        </div>
      </nav>

      {/* ✅ Main Content */}
      <div className="content">
        <h2 className="welcome-text">
          🚀 **Welcome to Your AI-Powered Learning Assistant!**  
          Say goodbye to hours of manual grading, lesson planning, and content creation.  
          **Our intelligent platform transforms education,** making learning **smarter, faster, and more personalized.**  
          <br /><br />
          ✅ **Instant Report Generation** – Upload your handwritten or printed assignments and get detailed insights instantly!  
          ✅ **AI-Powered Feedback** – Improve learning with accurate feedback, strengths, and improvement areas.  
          ✅ **Smart Content Creation** – Generate quizzes, custom worksheets, and personalized study materials effortlessly.  
          <br />
          🔥 **Empower your learning journey with AI. Let's make education smarter together!**  
        </h2>
      </div>
    </>
  );
}
