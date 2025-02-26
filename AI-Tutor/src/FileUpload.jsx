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

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // 🔄 Used for navigation

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("❌ Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("✅ File uploaded successfully!");

            // ✅ Navigate to ReportPage & pass the report data
            navigate("/report", { state: { report: response.data.report } });

        } catch (error) {
            setMessage("❌ Upload failed. Try again.");
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white shadow-lg rounded-xl p-6 max-w-md w-full text-center">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload a File</h2>
                
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0 file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
                />

                <button 
                    onClick={handleUpload} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                    Upload
                </button>

                {message && (
                    <p className="mt-4 text-gray-600 bg-gray-200 px-4 py-2 rounded-md">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
