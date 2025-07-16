import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LawyerLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "", // Changed from lawyerId to email
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

    

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/users/login/`,
            formData
        );
        console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
        console.log("Lawyer Login response:", response.data);
        

        // Store authentication data in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("refresh", response.data.refresh);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Redirect based on user type
        if (response.data.user.user_type === "lawyer") {
            navigate("/lawyer-dashboard");
        } else {
            setError("Unauthorized access. You are not a lawyer.");
        }
    } catch (err) {
        console.error("Lawyer Login error:", err.response?.data || err.message);
        setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  const handleCreateAccount = () => {
    navigate("/lawyer-signup");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Lawyer Login
        </h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Field - Changed from Lawyer ID */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Create Account Section */}
        <div className="mt-6">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <button
            onClick={handleCreateAccount}
            className="mt-2 text-blue-600 font-medium hover:underline block"
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