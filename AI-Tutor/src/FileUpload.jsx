import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // 🔄 Used for navigation

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("File uploaded successfully!");

            // ✅ Navigate to ReportPage & pass the report data
            navigate("/report", { state: { report: response.data.report } });

        } catch (error) {
            setMessage("Upload failed. Try again.");
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="upload-container">
            <h2>Upload a File</h2>
            <input type="file" onChange={handleFileChange} className="file-input" />
            <button onClick={handleUpload} className="upload-button">Upload</button>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default FileUpload;
