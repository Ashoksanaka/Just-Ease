import React from "react";
import { useNavigate } from "react-router-dom"; // Updated import

const WelcomePage = () => {
  const navigate = useNavigate(); // Updated hook

  // Function to handle button clicks (Lawyer or Victim)
  const handleButtonClick = (role) => {
    if (role === "lawyer") {
      navigate("/lawyer");  // Updated navigation
    } else {
      navigate("/victim");  // Updated navigation
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-200">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">Just-Ease</h1>
        <p className="text-lg text-gray-500 mb-6">Simplifying access to justice</p>

        <div className="space-y-4">
          <button
            onClick={() => handleButtonClick("lawyer")}
            className="w-60 py-2 px-4 bg-blue-500 text-white rounded-full text-lg hover:bg-blue-600 transition-all duration-300"
          >
            I am a Lawyer
          </button>
          <button
            onClick={() => handleButtonClick("victim")}
            className="w-60 py-2 px-4 bg-green-500 text-white rounded-full text-lg hover:bg-green-600 transition-all duration-300"
          >
            I am a Victim
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;