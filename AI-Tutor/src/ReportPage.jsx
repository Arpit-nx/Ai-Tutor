import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReportPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // ✅ Extract report data (if available)
    const report = location.state?.report || "No report available.";

    return (
        <div className="report-container">
            <h2>Generated Report</h2>
            <div className="report-box">
                <p>{report}</p>
            </div>
            <button className="back-button" onClick={() => navigate("/")}>
                Back to Upload
            </button>
        </div>
    );
};

export default ReportPage;
