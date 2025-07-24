"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, User, Phone, MapPin, FileText, CheckCircle, AlertCircle, Shield, Heart } from "lucide-react"

const CreateCase = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    victimName: "",
    mobileNumber: "",
    address: "",
    category: "",
    subCategories: [],
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({})
  const [states, setStates] = useState([])
  const [towns, setTowns] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/victim")
      return
    }

    const fetchLocationData = async () => {
      try {
        const response = await fetch("/india-states-towns.json")
        const data = await response.json()
        setStates(Object.keys(data))
        setTowns([])
      } catch (error) {
        console.error("Error fetching location data:", error)
      }
    }

    const fetchCaseCategories = async () => {
      try {
        const response = await fetch("/CaseCategories.json")
        const data = await response.json()
        setCategories(Object.keys(data))
        setSubCategories([])
      } catch (error) {
        console.error("Error fetching case categories:", error)
      }
    }

    fetchLocationData()
    fetchCaseCategories()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value,
      }

      if (name === "state") {
        fetch("/india-states-towns.json")
          .then((response) => response.json())
          .then((data) => {
            setTowns(data[value])
            updatedFormData.address = `${value}, `
          })
          .catch((error) => console.error("Error fetching towns:", error))
      }

      if (name === "category") {
        fetch("/CaseCategories.json")
          .then((response) => response.json())
          .then((data) => {
            setSubCategories(data[value])
            updatedFormData.subCategories = []
          })
          .catch((error) => console.error("Error fetching subcategories:", error))
      }

      return updatedFormData
    })
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }))
  }

  const handleTownChange = (e) => {
    const town = e.target.value
    setFormData((prevFormData) => ({
      ...prevFormData,
      nearestTown: town,
      address: `${prevFormData.state}, ${town}`,
    }))
  }

  const handleSubCategoryChange = (subCategory) => {
    setFormData((prevFormData) => {
      const currentSubCategories = [...prevFormData.subCategories]

      if (currentSubCategories.includes(subCategory)) {
        return {
          ...prevFormData,
          subCategories: currentSubCategories.filter((item) => item !== subCategory),
        }
      } else {
        return {
          ...prevFormData,
          subCategories: [...currentSubCategories, subCategory],
        }
      }
    })
  }

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.victimName.trim()) {
        newErrors.victimName = "Victim Name is required"
      }
      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = "Mobile Number is required"
      } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = "Mobile number must be 10 digits"
      }
    }

    if (step === 2) {
      if (!formData.address) {
        newErrors.address = "Address (State and Town) is required"
      }
    }

    if (step === 3) {
      if (!formData.category) {
        newErrors.category = "Case Category is required"
      }
      if (formData.subCategories.length === 0) {
        newErrors.subCategories = "At least one Sub-Category must be selected"
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateStep(3)) {
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found.")
      }

      const data = new FormData()
      data.append("victimName", formData.victimName)
      data.append("mobileNumber", formData.mobileNumber)
      data.append("address", formData.address)
      data.append("category", formData.category)
      formData.subCategories.forEach((subCategory) => {
        data.append("subCategories", subCategory)
      })

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cases/create-case/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      setMessage("Case created successfully!")
      setFormData({
        victimName: "",
        mobileNumber: "",
        address: "",
        category: "",
        subCategories: [],
      })
      setErrors({})
      setCurrentStep(4) // Success step
    } catch (error) {
      console.error("Error creating case:", error)
      setMessage(error.response?.data?.message || "Failed to create case. Please try again.")
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("refresh")
      }
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { number: 1, title: "Personal Information", icon: <User className="w-5 h-5" /> },
    { number: 2, title: "Location Details", icon: <MapPin className="w-5 h-5" /> },
    { number: 3, title: "Case Information", icon: <FileText className="w-5 h-5" /> },
    { number: 4, title: "Confirmation", icon: <CheckCircle className="w-5 h-5" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/victim-dashboard")}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-green-600" />
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
                      ? "bg-green-600 border-green-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${currentStep > step.number ? "bg-green-600" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div key={step.number} className="text-xs text-center" style={{ width: "120px" }}>
                <span className={currentStep >= step.number ? "text-green-600 font-medium" : "text-gray-500"}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-white">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold">Create New Case</h1>
                <p className="text-green-100">We're here to help you seek justice safely and confidentially</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-start space-x-3 ${
                  message.includes("success")
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {message.includes("success") ? (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                <div className={message.includes("success") ? "text-green-700" : "text-red-700"}>{message}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
                    <p className="text-gray-600 mb-6">
                      Please provide your basic information. All data is encrypted and confidential.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="victimName"
                          value={formData.victimName}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            errors.victimName ? "border-red-300" : "border-gray-300"
                          }`}
                        />
                      </div>
                      {errors.victimName && <p className="mt-1 text-sm text-red-600">{errors.victimName}</p>}
                    </div>

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
                          className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                            errors.mobileNumber ? "border-red-300" : "border-gray-300"
                          }`}
                          maxLength="10"
                        />
                      </div>
                      {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Location Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
                    <p className="text-gray-600 mb-6">
                      Please provide your location information for proper case assignment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                          errors.state ? "border-red-300" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select State</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nearest Town *</label>
                      <select
                        name="nearestTown"
                        value={formData.nearestTown}
                        onChange={handleTownChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                          errors.nearestTown ? "border-red-300" : "border-gray-300"
                        }`}
                        disabled={!formData.state}
                      >
                        <option value="">Select Town</option>
                        {towns.map((town) => (
                          <option key={town} value={town}>
                            {town}
                          </option>
                        ))}
                      </select>
                      {errors.nearestTown && <p className="mt-1 text-sm text-red-600">{errors.nearestTown}</p>}
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
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Case Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Information</h2>
                    <p className="text-gray-600 mb-6">
                      Please select the category and subcategories that best describe your case.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Case Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                          errors.category ? "border-red-300" : "border-gray-300"
                        }`}
                      >
                        <option value="">Select Case Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                      {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub-Categories * (Select all that apply)
                      </label>
                      <div
                        className={`border rounded-lg p-4 max-h-40 overflow-y-auto ${
                          errors.subCategories ? "border-red-300" : "border-gray-300"
                        }`}
                      >
                        {subCategories.length > 0 ? (
                          <div className="space-y-2">
                            {subCategories.map((subCategory) => (
                              <label key={subCategory} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={formData.subCategories.includes(subCategory)}
                                  onChange={() => handleSubCategoryChange(subCategory)}
                                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">{subCategory}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Select a category first</p>
                        )}
                      </div>
                      {errors.subCategories && <p className="mt-1 text-sm text-red-600">{errors.subCategories}</p>}
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
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <span>Submit Case</span>
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Submitted Successfully!</h2>
                  <p className="text-gray-600 mb-6">
                    Your case has been submitted and will be reviewed by our legal professionals. You will be contacted
                    within 24-48 hours.
                  </p>
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate("/victim-dashboard")}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setCurrentStep(1)
                        setFormData({
                          victimName: "",
                          mobileNumber: "",
                          address: "",
                          category: "",
                          subCategories: [],
                        })
                        setMessage("")
                        setErrors({})
                      }}
                      className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Submit Another Case
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Your Safety & Privacy</h3>
              <p className="text-blue-800 text-sm">
                All information you provide is encrypted and confidential. Our platform uses industry-standard security
                measures to protect your data. If you're in immediate danger, please contact emergency services at 911
                or the crisis helpline at 1-800-799-7233.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCase
