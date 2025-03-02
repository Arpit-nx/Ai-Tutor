import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Reports.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
  
    fetch("http://127.0.0.1:5000/reports") // Ensure the correct endpoint
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched Reports Data:", data);
        if (data.reports && Array.isArray(data.reports)) {
          setReports(data.reports);
        } else {
          console.error("Unexpected data format:", data);
          setError("Invalid data received from server");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(`Failed to fetch reports: ${err.message}`);
        setLoading(false);
      });
  }, []);
  
  const filteredReports = reports.filter((report) =>
    report.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openReportPage = (report) => {
    navigate("/report", { state: { reportId: report._id } }); // Navigate to ReportPage
  };

  return (
    <div className="reports-container">
      <h2>Reports</h2>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search by Name, Subject, or Date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* ✅ Display Loading / Error State */}
      {loading && <p>Loading reports...</p>}
      {error && <p className="error-message">{error}</p>}

      {/* ✅ Reports List */}
      <div className="reports-list">
        {filteredReports.map((report, index) => (
          <div key={index} className="report-card" onClick={() => openReportPage(report)}>
            <h3>{report.filename}</h3>
            <p><strong>Subject:</strong> {report.subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
