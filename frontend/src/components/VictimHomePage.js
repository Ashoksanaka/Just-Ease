import React from "react";
import { useNavigate } from "react-router-dom";

const VictimLoginPage = () => {
  const navigate = useNavigate();

  const handleCreateAccount = () => {
    navigate("/victim-signup"); // Redirect to the signup page
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
          Victim Login
        </h1>
        <form className="space-y-4">
          {/* Mobile Number Field */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              placeholder="Enter your mobile number"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
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
              placeholder="Enter your password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-green-600 transition-all duration-300"
          >
            Login
          </button>
        </form>

        {/* Create Account Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <button
            onClick={handleCreateAccount}
            className="mt-2 text-green-600 font-medium hover:underline"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictimLoginPage;