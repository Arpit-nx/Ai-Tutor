// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const FileUpload = () => {
//     const [file, setFile] = useState(null);
//     const [message, setMessage] = useState("");
//     const navigate = useNavigate(); // 🔄 Used for navigation

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleUpload = async () => {
//         if (!file) {
//             setMessage("Please select a file.");
//             return;
//         }

//         const formData = new FormData();
//         formData.append("file", file);

//         try {
//             const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             setMessage("File uploaded successfully!");

//             // ✅ Navigate to ReportPage & pass the report data
//             navigate("/report", { state: { report: response.data.report } });

//         } catch (error) {
//             setMessage("Upload failed. Try again.");
//             console.error("Error uploading file:", error);
//         }
//     };

//     return (
//         <div className="upload-container">
//             <h2>Upload a File</h2>
//             <input type="file" onChange={handleFileChange} className="file-input" />
//             <button onClick={handleUpload} className="upload-button">Upload</button>

//             {message && <p className="message">{message}</p>}
//         </div>
//     );
// };

// export default FileUpload;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FileUpload.css";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
    };

    const handleUpload = async () => {
        if (!file || !subject.trim()) {
            setMessage("❌ Please select a file and enter a subject.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", subject);
    
        try {
            const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    
            console.log("Upload Response:", response.data);  // ✅ Debug response
            if (response.data.error) {
                setMessage(`❌ Upload failed: ${response.data.error}`);
            } else {
                setMessage("✅ File uploaded successfully!");
                navigate("/report", { state: { reportId: response.data.report_id } });
            }
        } catch (error) {
            console.error("Upload Error:", error.response?.data || error);
            setMessage("❌ Upload failed. Check console for details.");
        }
    };    

    return (
        <div className="upload-container">
            <div className="upload-box">
                <h2 className="upload-title">Upload a File</h2>

                <label className="file-label">Choose a file</label>
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="file-input"
                />

                <input 
                    type="text"
                    placeholder="Enter subject"
                    value={subject}
                    onChange={handleSubjectChange}
                    className="subject-input"
                />

                <button 
                    onClick={handleUpload} 
                    className="upload-button"
                >
                    Upload
                </button>

                {message && (
                    <p className={`upload-message ${message.includes("❌") ? "error" : "success"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
