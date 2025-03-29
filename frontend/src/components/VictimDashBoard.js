import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VictimDashBoard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [cases, setCases] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [casesError, setCasesError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      navigate("/victim-login");
      return;
    }

    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    const fetchCases = async () => {
      setLoadingCases(true);
      setCasesError(null);
      try {
        const response = await axios.get("http://localhost:8000/api/cases/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCases(response.data);
      } catch (err) {
        console.error("Error fetching cases:", err);
        setCasesError(
          err.response?.data?.message || "Failed to fetch cases."
        );
        if (err.response?.status === 401) {
          // Handle unauthorized error (e.g., token expired)
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("refresh");
          navigate("/victim-login");
        }
      } finally {
        setLoadingCases(false);
      }
    };

    fetchCases();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh");
    navigate("/victim-login");
  };

  const handleCreateCase = () => {
    navigate("/create-case");
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Just-Ease</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-100 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Welcome
            {userData ? `, ${userData.first_name} ${userData.last_name}` : ""}!
          </h2>
          <p className="text-gray-600">
            Thank you for using Just-Ease. This platform is designed to support
            you through your legal journey.
          </p>
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Case Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-green-600 mb-3">
              Case Status
            </h3>
            {loadingCases ? (
              <p className="text-gray-600">Loading cases...</p>
            ) : casesError ? (
              <p className="text-red-500">{casesError}</p>
            ) : cases.length > 0 ? (
              <ul>
                {cases.map((caseItem) => (
                  <li key={caseItem.id} className="text-gray-600">
                    Case ID: {caseItem.id} - Victim: {caseItem.victimName}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                You currently have no active cases. To file a new case, please
                use the "New Case" button below.
              </p>
            )}
            <button
              onClick={handleCreateCase}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              New Case
            </button>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-green-600 mb-3">
              Resources
            </h3>
            <ul className="list-disc list-inside text-gray-600">
              <li className="mb-2">Legal Aid Information</li>
              <li className="mb-2">Victim Support Services</li>
              <li className="mb-2">Document Templates</li>
              <li className="mb-2">FAQ</li>
            </ul>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-green-600 mb-3">
              Upcoming Events
            </h3>
            <p className="text-gray-600">
              You have no upcoming events or appointments scheduled.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-600 text-white py-4 mt-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Just-Ease. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default VictimDashBoard;
