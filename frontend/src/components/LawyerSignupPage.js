"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import {
  Scale,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Shield,
  Clock,
  Send,
} from "lucide-react"

const LawyerSignupPage = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    dateOfBirth: "",
    barRegistrationId: "",
    governmentIdProof: null,
    lawyerIdProof: null,
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const steps = [
    { number: 1, title: "Personal Info", icon: <User className="w-4 h-4" /> },
    { number: 2, title: "Professional Details", icon: <Scale className="w-4 h-4" /> },
    { number: 3, title: "Document Upload", icon: <Upload className="w-4 h-4" /> },
    { number: 4, title: "Verification", icon: <CheckCircle className="w-4 h-4" /> },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (name === "email") {
      setIsEmailVerified(false)
      setCodeSent(false)
    }

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target

    if (files.length > 0) {
      const file = files[0]

      if (file.type !== "application/pdf") {
        setErrors({
          ...errors,
          [name]: "Only PDF files are allowed",
        })
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors({
          ...errors,
          [name]: "File size must be less than 5MB",
        })
        return
      }

      setFormData({
        ...formData,
        [name]: file,
      })

      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: null,
        })
      }
    }
  }

  const handleSendVerificationCode = async () => {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ ...errors, email: "Please enter a valid email address" })
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/send_email_verification/`, {
        email: formData.email,
      })
      if (response.status === 200) {
        setCodeSent(true)
        setErrors({ ...errors, email: null })
        // Show success message
      }
    } catch (error) {
      setErrors({ ...errors, email: error.response?.data?.error || error.message })
    }
    setLoading(false)
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors({ ...errors, verificationCode: "Please enter verification code" })
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/verify_email_otp/`, {
        email: formData.email,
        otp: verificationCode,
      })
      if (response.status === 200) {
        setIsEmailVerified(true)
        setErrors({ ...errors, verificationCode: null })
      }
    } catch (error) {
      setErrors({ ...errors, verificationCode: error.response?.data?.error || error.message })
      setIsEmailVerified(false)
    }
    setLoading(false)
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!isEmailVerified) {
        newErrors.email = "Email must be verified"
      }
      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = "Mobile number is required"
      } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = "Mobile number must be 10 digits"
      }
    }

    if (step === 2) {
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
      if (!formData.barRegistrationId.trim()) newErrors.barRegistrationId = "BAR registration ID is required"
    }

    if (step === 3) {
      if (!formData.governmentIdProof) newErrors.governmentIdProof = "Government ID proof is required"
      if (!formData.lawyerIdProof) newErrors.lawyerIdProof = "Lawyer ID proof is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(",")[1])
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep(3)) {
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append("Full_Name", formData.fullName)
      data.append("Email_ID", formData.email)
      data.append("Mobile_Number", formData.mobileNumber)
      data.append("Date_of_Birth", formData.dateOfBirth)
      data.append("BAR_registration_ID", formData.barRegistrationId)

      if (formData.governmentIdProof) {
        const govIdBase64 = await convertFileToBase64(formData.governmentIdProof)
        data.append("Government_ID_Proof", govIdBase64)
        data.append("Government_ID_Proof_Name", formData.governmentIdProof.name)
      }

      if (formData.lawyerIdProof) {
        const lawyerIdBase64 = await convertFileToBase64(formData.lawyerIdProof)
        data.append("Lawyer_ID_Proof", lawyerIdBase64)
        data.append("Lawyer_ID_Proof_Name", formData.lawyerIdProof.name)
      }

      const SCRIPT_URL =
        "https://script.google.com/macros/s/AKfycbwqjfy3YOzyvZEnPBPwbxp-cumRiEO2WyUGhcWNQ5nBxLxhVBbuyt1idCFDkx-ggzZB6Q/exec"
      const response = await axios.post(SCRIPT_URL, data)
      const result = response.data

      if (result.result === "success") {
        setCurrentStep(4) // Success step
      } else {
        throw new Error(result.error || "An unknown error occurred in the script.")
      }
    } catch (error) {
      setErrors({
        ...errors,
        submit: "An error occurred during submission. Please try again.",
      })
      console.error("Submission error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/lawyer")}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">JustEase</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${currentStep > step.number ? "bg-blue-600" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.number} className="text-xs text-center" style={{ width: "120px" }}>
                <span className={currentStep >= step.number ? "text-blue-600 font-medium" : "text-gray-500"}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <Scale className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold">Legal Professional Registration</h1>
                <p className="text-blue-100">Join our platform to connect with clients and grow your practice</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                    <p className="text-gray-600 mb-6">Please provide your basic information to get started.</p>
                  </div>

                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.fullName ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
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
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email address"
                            disabled={isEmailVerified}
                            className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                              errors.email ? "border-red-300" : "border-gray-300"
                            } ${isEmailVerified ? "bg-green-50" : ""}`}
                          />
                          {isEmailVerified && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                        </div>

                        {!isEmailVerified && (
                          <button
                            type="button"
                            onClick={handleSendVerificationCode}
                            disabled={!formData.email || loading}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {loading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                            <span>{loading ? "Sending..." : "Send Verification Code"}</span>
                          </button>
                        )}

                        {codeSent && !isEmailVerified && (
                          <div className="space-y-3">
                            <div className="relative">
                              <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Enter 6-digit verification code"
                                maxLength="6"
                                className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                  errors.verificationCode ? "border-red-300" : "border-gray-300"
                                }`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleVerifyCode}
                              disabled={!verificationCode || loading}
                              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              <span>{loading ? "Verifying..." : "Verify Code"}</span>
                            </button>
                            {errors.verificationCode && (
                              <p className="text-sm text-red-600">{errors.verificationCode}</p>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="Enter 10-digit mobile number"
                          maxLength="10"
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.mobileNumber ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Professional Details</h2>
                    <p className="text-gray-600 mb-6">Please provide your professional credentials.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.dateOfBirth ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
                    </div>

                    {/* BAR Registration ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">BAR Registration ID *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Scale className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="barRegistrationId"
                          value={formData.barRegistrationId}
                          onChange={handleChange}
                          placeholder="Enter your BAR registration ID"
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.barRegistrationId ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.barRegistrationId && (
                        <p className="mt-1 text-sm text-red-600">{errors.barRegistrationId}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Document Upload */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h2>
                    <p className="text-gray-600 mb-6">Please upload the required documents for verification.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Government ID Proof */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Government ID Proof *</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                          errors.governmentIdProof ? "border-red-300" : "border-gray-300"
                        }`}
                      >
                        <input
                          type="file"
                          name="governmentIdProof"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="governmentIdProof"
                        />
                        <label htmlFor="governmentIdProof" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">
                            {formData.governmentIdProof ? formData.governmentIdProof.name : "Click to upload PDF"}
                          </p>
                          <p className="text-xs text-gray-500">Aadhar, PAN, Driving License, or Voter ID</p>
                        </label>
                      </div>
                      {errors.governmentIdProof && (
                        <p className="mt-1 text-sm text-red-600">{errors.governmentIdProof}</p>
                      )}
                    </div>

                    {/* Lawyer ID Proof */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lawyer ID Proof *</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                          errors.lawyerIdProof ? "border-red-300" : "border-gray-300"
                        }`}
                      >
                        <input
                          type="file"
                          name="lawyerIdProof"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="lawyerIdProof"
                        />
                        <label htmlFor="lawyerIdProof" className="cursor-pointer">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">
                            {formData.lawyerIdProof ? formData.lawyerIdProof.name : "Click to upload PDF"}
                          </p>
                          <p className="text-xs text-gray-500">BAR Council Certificate or License</p>
                        </label>
                      </div>
                      {errors.lawyerIdProof && <p className="mt-1 text-sm text-red-600">{errors.lawyerIdProof}</p>}
                    </div>
                  </div>

                  {/* File Upload Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-blue-800 text-sm">
                        <p className="font-medium mb-1">Document Guidelines:</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          <li>Only PDF files are accepted</li>
                          <li>Maximum file size: 5MB per document</li>
                          <li>Documents must be clear and readable</li>
                          <li>All information must be visible and unredacted</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Application</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {currentStep === 4 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Application Submitted Successfully!</h2>
                  <p className="text-gray-600 mb-6">
                    Your registration application has been submitted for verification. Our team will review your
                    documents and contact you within 2-3 business days.
                  </p>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-yellow-800 text-sm">
                        <p className="font-medium">What happens next?</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Document verification (1-2 business days)</li>
                          <li>Background check and credential validation</li>
                          <li>Account activation via email</li>
                          <li>Welcome package with platform guidelines</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/lawyer")}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Go to Login
                    </button>
                    <button
                      onClick={() => navigate("/")}
                      className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.submit && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="text-red-700 text-sm">{errors.submit}</div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you encounter any issues during registration, our support team is here to help.
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <a href="mailto:support@justease.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                Email Support
              </a>
              <span className="text-gray-300">|</span>
              <a href="tel:+1-800-JUSTICE" className="text-blue-600 hover:text-blue-700 transition-colors">
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawyerSignupPage
