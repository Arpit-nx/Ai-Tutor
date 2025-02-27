import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./FileUpload";
import ReportPage from "./ReportPage";
import Navbar from "./Navbar";
import "./App.css"; 
import "./Navbar.css"; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navbar />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/upload" element={<FileUpload />} />
            </Routes>
        </Router>
    );
}

export default App;
