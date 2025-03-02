import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./FileUpload";
import ReportPage from "./ReportPage";
import Reports from "./Reports";
import Navbar from "./Navbar";
import Auth from "./Auth"; 
import "./App.css"; 
import "./Navbar.css"; 

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/dashboard" element={<Navbar />} />
                <Route path="/FileUpload" element={<FileUpload />} />
                <Route path="/Reports" element={<Reports />} />
                <Route path="/report" element={<ReportPage />} />
            </Routes>
        </Router>
    );
}

export default App;
