import React, { useState } from "react";
import axios from "axios";

const Admin = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Check password match whenever password changes
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    // Check password match whenever confirm password changes
    if (password && e.target.value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Reset error messages
    setErrorMessage("");
    setPasswordError("");
    
    // Validate all fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMessage("Please complete all fields.");
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    try {
      // Using the signup endpoint from backend/users/views.py
      const response = await axios.post("http://127.0.0.1:8000/api/users/signup/", {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });
      
      if (response.status === 200) {
        setErrorMessage("");
        setSuccessMessage("Admin created successfully!");
        // Clear form fields after successful submission
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error creating admin. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-6">Create Lawyer Account</h1>

        <form onSubmit={handleSubmit}>
          {/* First Name Input */}
          <div className="mb-4">
            <label htmlFor="first_name" className="block font-medium">First Name:</label>
            <input
              type="text"
              id="first_name"
              value={firstName}
              onChange={handleFirstNameChange}
              className="w-full p-2 border rounded"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name Input */}
          <div className="mb-4">
            <label htmlFor="last_name" className="block font-medium">Last Name:</label>
            <input
              type="text"
              id="last_name"
              value={lastName}
              onChange={handleLastNameChange}
              className="w-full p-2 border rounded"
              placeholder="Enter last name"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium">Email ID:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full p-2 border rounded"
              placeholder="Enter email address"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block font-medium">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded"
              placeholder="Enter password"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label htmlFor="confirm_password" className="block font-medium">Confirm Password:</label>
            <input
              type="password"
              id="confirm_password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="w-full p-2 border rounded"
              placeholder="Re-enter password"
            />
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
          
          {/* Success Message */}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Create Lawyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Admin;