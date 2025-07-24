"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Shield,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Heart,
  Send,
  Phone,
} from "lucide-react"

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Successful!</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Login Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const VictimSignupPage = () => {
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [showOtpField, setShowOtpField] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value)
    if (errorMessage) setErrorMessage("")
  }

  const handleLastNameChange = (e) => {
    setLastName(e.target.value)
    if (errorMessage) setErrorMessage("")
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setIsEmailVerified(false)
    setShowOtpField(false)
    if (errorMessage) setErrorMessage("")
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError("Passwords do not match")
    } else {
      setPasswordError("")
    }
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
    if (password && e.target.value !== password) {
      setPasswordError("Passwords do not match")
    } else {
      setPasswordError("")
    }
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value)
  }

  const sendEmailVerification = async () => {
    if (!email) {
      setErrorMessage("Please enter your email address")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/send_email_verification/`, {
        email: email,
      })
      if (response.status === 200) {
        setErrorMessage("")
        setSuccessMessage("Verification OTP sent to your email. Please check your inbox.")
        setShowOtpField(true)
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to send email verification. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const verifyEmailOtp = async () => {
    if (!otp) {
      setErrorMessage("Please enter the verification code")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/verify_email_otp/`, {
        email: email,
        otp: otp,
      })
      if (response.status === 200) {
        setErrorMessage("")
        setSuccessMessage("Email verified successfully! You can now complete signup.")
        setIsEmailVerified(true)
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    setErrorMessage("")
    setPasswordError("")

    if (!firstName || !lastName || !email || !password || !confirmPassword || !isEmailVerified) {
      setErrorMessage("Please complete all fields and verify your email address.")
      return
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return
    }

    setLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/signup/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        isVictim: true,
        isLawyer: false,
      })
      if (response.status === 200) {
        setErrorMessage("")
        setSuccessMessage("User registered successfully!")
        setShowConfirmDialog(true)
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Error during signup. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/victim")}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-lg font-semibold text-gray-900">JustEase</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
            <div className="text-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Create Your Safe Account</h1>
              <p className="text-green-100 text-sm">Join our secure platform to access legal support</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Supportive Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <Heart className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="text-green-700 text-sm">
                <p className="font-medium mb-1">You're taking a brave step</p>
                <p>We're here to provide you with a safe, confidential space to seek the justice you deserve.</p>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-red-700 text-sm">{errorMessage}</div>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-green-700 text-sm">{successMessage}</div>
              </div>
            )}

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={handleFirstNameChange}
                      placeholder="First name"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={handleLastNameChange}
                    placeholder="Last name"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email with Verification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <div className="space-y-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                        isEmailVerified ? "bg-green-50 border-green-300" : "border-gray-300"
                      }`}
                      disabled={isEmailVerified}
                    />
                    {isEmailVerified && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>

                  {!isEmailVerified && (
                    <button
                      onClick={sendEmailVerification}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>{loading ? "Sending..." : "Verify Email"}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* OTP Input */}
              {showOtpField && !isEmailVerified && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code *</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter 6-digit code"
                      maxLength="6"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    />
                    <button
                      onClick={verifyEmailOtp}
                      disabled={loading}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>{loading ? "Verifying..." : "Verify Code"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Create a secure password"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="Confirm your password"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
              </div>

              {/* Email Verification Status */}
              {isEmailVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 text-sm font-medium">Email verified successfully</span>
                </div>
              )}

              {/* Signup Button */}
              <button
                onClick={handleSignup}
                disabled={!isEmailVerified || loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Secure Account</span>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => navigate("/victim")}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Crisis Support */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Phone className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-red-700 font-medium mb-1">Need Immediate Help?</p>
              <p className="text-xs text-red-600">Emergency Services: 911</p>
              <p className="text-xs text-red-600">Crisis Helpline: 1-800-799-7233 (24/7 Support)</p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-green-600 hover:text-green-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-green-600 hover:text-green-700">
              Privacy Policy
            </a>
            . Your privacy and security are our top priorities.
          </p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmDialog
          message="Your account has been created successfully! Would you like to sign in now?"
          onConfirm={() => {
            setShowConfirmDialog(false)
            navigate("/victim")
          }}
          onCancel={() => {
            setShowConfirmDialog(false)
            navigate("/")
          }}
        />
      )}
    </div>
  )
}

export default VictimSignupPage
