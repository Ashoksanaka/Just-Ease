import React, { useState } from "react";

const VictimSignupPage = () => {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [showMobileVerify, setShowMobileVerify] = useState(false);
  const [showEmailVerify, setShowEmailVerify] = useState(false);

  const handleMobileChange = (e) => {
    const value = e.target.value;
    setMobile(value);
    if (value.length === 10) {
      setShowMobileVerify(true);
    } else {
      setShowMobileVerify(false);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (/\S+@\S+\.\S+/.test(value)) {
      setShowEmailVerify(true);
    } else {
      setShowEmailVerify(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
          Create an Account
        </h1>
        <form className="space-y-4">
          {/* First Name Field */}
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Last Name Field */}
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

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
              value={mobile}
              onChange={handleMobileChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {showMobileVerify && (
              <button
                type="button"
                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-300"
              >
                Verify Mobile Number
              </button>
            )}
          </div>

          {/* Email ID Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email ID
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email ID"
              value={email}
              onChange={handleEmailChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {showEmailVerify && (
              <button
                type="button"
                className="mt-2 bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-all duration-300"
              >
                Verify Email ID
              </button>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg text-lg font-medium hover:bg-blue-600 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default VictimSignupPage;