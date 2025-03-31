import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LawyerLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    lawyerId: "", // Changed from email to lawyerId
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("Sending lawyer login request with data:", formData);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/lawyers/login/", // Changed endpoint
        formData
      );
      console.log("Lawyer Login response:", response.data);

      // Store authentication data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect to dashboard
      navigate("/lawyer-dashboard"); // Changed route
    } catch (err) {
      console.error("Lawyer Login error:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  const handleCreateAccount = () => {
    navigate("/lawyer-signup"); // Changed route
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100"> {/* Changed background color */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6"> {/* Changed text color */}
          Lawyer Login
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Lawyer ID Field */}
          <div>
            <label
              htmlFor="lawyerId" // Changed htmlFor
              className="block text-sm font-medium text-gray-700"
            >
              Just-Ease ID {/* Changed label */}
            </label>
            <input
              type="text" // Changed type
              id="lawyerId" // Changed id
              name="lawyerId" // Changed name
              value={formData.lawyerId} // Changed value
              onChange={handleChange}
              placeholder="Enter your Just-Ease ID"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" // Changed focus color
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500" // Changed focus color
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition-all duration-300" // Changed button color
          >
            Login
          </button>
        </form>

        {/* Create Account Section */}
        <div className="mt-6">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <button
            onClick={handleCreateAccount}
            className="mt-2 text-blue-600 font-medium hover:underline block" // Changed text color
          >
            Create Account
          </button>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="mt-2 text-blue-600 font-medium hover:underline block"
          >
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerLoginPage;
