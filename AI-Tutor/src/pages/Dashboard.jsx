import React from "react";
import Navbar from "../components/Navbar";
import FileUpload from "../components/FileUpload";
import CollectedFiles from "../components/CollectedFiles";
import CollectedReports from "../components/CollectedReports";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Navbar />
      <div className="content">
        <FileUpload />
        <CollectedFiles />
        <CollectedReports />
      </div>
    </div>
  );
};

export default Dashboard;
