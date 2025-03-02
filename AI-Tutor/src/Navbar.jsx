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
                {/* ✅ Report Button - Navigates to /Reports */}
                <button className="upload-button" style={{ marginTop: "10px" }} onClick={() => navigate("/Reports")}>
                  Report
                </button>
              </div>
            )}
          </div>
          <div>
            <button className="logout-button">Logout</button>
          </div>
        </div>
      </nav>

      {/* ✅ Main Content */}
      <div className="content">
        <h1>
          <b classname="Head"><i> Welcome to Student Portal !</i></b>
        </h1>
        <br /><br />
        <h2 className="welcome-text">
          <br />
          <b>Assignments</b>

          <br /><br />


         <h4 className="list">
         
          <li>Uploaded Assignments</li>
          <br />
          <li>Test Components</li>
            
         
        
         </h4>
          
         
          
        </h2>
      </div>
    </>
  );
}
