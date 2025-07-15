import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

const VictimSignupPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Reset verification status when email changes
    setIsEmailVerified(false);
    setShowOtpField(false);
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

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const sendEmailVerification = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/send_email_verification/`, { email: email });
      if (response.status === 200) {
        setErrorMessage(""); // Clear any previous errors
        setSuccessMessage("Verification OTP sent to your email. Please check your inbox.");
        // Show OTP input field
        setShowOtpField(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to send email verification. Please try again.");
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/verify_email_otp/`, { 
        email: email,
        otp: otp 
      });
      if (response.status === 200) {
        setErrorMessage(""); // Clear any previous errors
        setSuccessMessage("Email verified successfully! You can now complete signup.");
        setIsEmailVerified(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to verify OTP. Please try again.");
    }
  };

  const handleSignup = async () => {
    // Reset error messages
    setErrorMessage("");
    setPasswordError("");
    
    // Validate all fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !isEmailVerified) {
      setErrorMessage("Please complete all fields and verify your email address.");
      return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/signup/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        isVictim: true,
        isLawyer: false,
      });
      if (response.status === 200) {
        setErrorMessage("");
        setSuccessMessage("User registered successfully!");
        setShowConfirmDialog(true);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error during signup. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-6">Create an Account</h1>

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
          <label htmlFor="email" className="block font-medium">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-2 border rounded"
            placeholder="Enter email address"
          />
          {email && !isEmailVerified && !showOtpField && (
            <button
              onClick={sendEmailVerification}
              className="mt-2 w-full py-2 bg-blue-500 text-white rounded"
            >
              Verify Email
            </button>
          )}
        </div>

        {/* OTP Input - Only show after sending verification email */}
        {showOtpField && (
          <div className="mb-4">
            <label htmlFor="otp" className="block font-medium">Enter OTP:</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={handleOtpChange}
              className="w-full p-2 border rounded"
              placeholder="Enter 6-digit OTP"
              maxLength="6"
            />
            <button
              onClick={verifyEmailOtp}
              className="mt-2 w-full py-2 bg-blue-500 text-white rounded"
            >
              Verify OTP
            </button>
          </div>
        )}

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
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        
        {/* Success Message */}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

        {/* Email Verification Status */}
        {isEmailVerified && (
          <p className="text-green-500 text-sm mb-4">✓ Email verified</p>
        )}

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className={`w-full py-2 ${isEmailVerified ? 'bg-green-500' : 'bg-gray-400'} text-white rounded mt-4`}
          disabled={!isEmailVerified}
        >
          Sign Up
        </button>

        {showConfirmDialog && (
          <ConfirmDialog
            message="User registered successfully! Do you want to login now?"
            onConfirm={() => {
              setShowConfirmDialog(false);
              navigate("/victim");
            }}
            onCancel={() => setShowConfirmDialog(false)}
          />
        )}
      </div>
    </div>
  );
};

export default VictimSignupPage;