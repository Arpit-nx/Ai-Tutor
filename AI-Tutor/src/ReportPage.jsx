import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ReportPage.css";

const ReportPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [report, setReport] = useState([]);  // ✅ Start with an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const reportId = location.state?.reportId;
        console.log("🚀 Received reportId:", reportId);

        if (!reportId) {
            setError("No report ID provided.");
            setLoading(false);
            return;
        }

        fetch(`http://127.0.0.1:5000/reports/${reportId}`)
            .then((res) => {
                console.log("📡 Fetching report...");
                return res.json();
            })
            .then((data) => {
                console.log("✅ Fetched Report Data:", data);

                if (data.report && Array.isArray(data.report.report)) { 
                    // ✅ Filter out empty strings
                    const filteredReport = data.report.report.filter(point => point.trim() !== "");
                    setReport(filteredReport);
                } else {
                    setError("Report not found or has incorrect format.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("❌ Error fetching report:", err);
                setError("Failed to fetch report.");
                setLoading(false);
            });
    }, [location.state]);    

    return (
        <div className="report-container">
            <h2 className="title">Report</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : report.length > 0 ? (  
                <div className="report-card">
                    <ul className="report-list">
                        {report.map((point, index) => (
                            <li key={index} className="report-item">
                                <strong>{index + 1}. </strong> {point}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>No report data available.</p>
            )}

            <button className="download-button" onClick={handleDownloadPDF}>
                Download as PDF
            </button>

            <button className="back-button" onClick={() => navigate("/FileUpload")}>
                Back to Upload
            </button>
        </div>
    );
};

export default ReportPage;
