import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openAssignments, setOpenAssignments] = useState(false);
  const [user, setUser] = useState({ name: "Guest", email: "N/A", role: "N/A" });
  const navigate = useNavigate();

  // ✅ Fetch user details from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // ✅ Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".profile-dropdown") && !event.target.closest(".assignments-dropdown")) {
        setOpenProfile(false);
        setOpenAssignments(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="navbar">
        <h1 className="navbar-title">Student Portal</h1>
        <div className="navbar-options">
          {/* ✅ Assignments Dropdown */}
          <div className="assignments-dropdown">
            <button onClick={() => setOpenAssignments(!openAssignments)} className="profile-button">
              Assignments ▼
            </button>
            {openAssignments && (
              <div className="dropdown-content">
                <button className="upload-button" onClick={() => navigate("/fileUpload")}>Maths</button>
                <button className="upload-button" onClick={() => navigate("/fileUpload")}>Science</button>
                <button className="upload-button" onClick={() => navigate("/fileUpload")}>DSA</button>
              </div>
            )}
          </div>

          {/* ✅ Profile Dropdown */}
          <div className="profile-dropdown">
            <button onClick={() => setOpenProfile(!openProfile)} className="profile-button">
              <FaUserCircle size={20} /> {user.name} ▼
            </button>
            {openProfile && (
              <div className="dropdown-content">
                <div className="dropdown-header">{user.name}</div>
                <div className="dropdown-item"><strong>Email:</strong> {user.email}</div>
                <div className="dropdown-item"><strong>Role:</strong> {user.role}</div>
                <hr />
                <button className="upload-button" style={{ marginTop: "10px" }} onClick={() => navigate("/Reports")}>
                  View Reports
                </button>
              </div>
            )}
          </div>

          {/* ✅ Logout Button (Moved Outside the Dropdown) */}
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* ✅ Main Content */}
      <div className="content">
        <h1>
          <b className="Head"><i> <b>Welcome to Cognito Portal !</b></i></b>
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
