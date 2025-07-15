import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LawyerDashBoard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
      navigate("/lawyer");
      return;
    }

    // Set user data from localStorage
    setUserData(user);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    navigate("/lawyer");
  };

  const handleExploreCases = () => {
    navigate("/explore-cases/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-semibold text-blue-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Just-Ease</h1>
          <div className="flex items-center space-x-4">
            <span className="font-medium">
              Welcome, {userData?.first_name + " " + userData?.last_name || userData?.email || "Lawyer"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for logging in to Just-Ease. This is your lawyer dashboard where you can manage your cases, 
            client communications, and legal documents.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
            <p className="text-blue-700">
              Your account is active and ready to use. Start exploring the features available to you.
            </p>
          </div>
        </div>

        {/* Dashboard Sections - Placeholder for future development */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">My Cases</h3>
            <p className="text-gray-600 mb-4">Manage your active and past legal cases here.</p>
            <button
              onClick={handleExploreCases}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200"
            >
              Explore Cases
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Client Messages</h3>
            <p className="text-gray-600">View and respond to client communications.</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Documents</h3>
            <p className="text-gray-600">Access and manage your legal documents.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Just-Ease. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LawyerDashBoard;