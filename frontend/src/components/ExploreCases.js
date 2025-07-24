"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  User,
  Phone,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Scale,
  SortAsc,
  SortDesc,
  RefreshCw,
} from "lucide-react"

const ExploreCases = () => {
  const [cases, setCases] = useState([])
  const [filteredCases, setFilteredCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterState, setFilterState] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const navigate = useNavigate()

  const statusColors = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
    in_progress: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
    resolved: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
    closed: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" },
  }

  const extractStateFromAddress = (address) => {
    if (!address) return ""
    const parts = address.split(",")
    return parts[0].trim()
  }

  useEffect(() => {
    fetchCases()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [cases, filterState, filterCategory, filterStatus, sortOrder, searchTerm])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cases/explore/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })

      setCases(response.data)
      setFilteredCases(response.data)
      setLoading(false)
    } catch (err) {
      setError("Failed to fetch cases. Please try again later.")
      setLoading(false)
      console.error("Error fetching cases:", err)
    }
  }

  const applyFilters = () => {
    let result = [...cases]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (case_) =>
          case_.victim_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          case_.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          case_.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply state filter
    if (filterState) {
      result = result.filter((case_) => {
        const caseState = extractStateFromAddress(case_.address)
        return caseState === filterState
      })
    }

    // Apply category filter
    if (filterCategory) {
      result = result.filter((case_) => case_.category === filterCategory)
    }

    // Apply status filter
    if (filterStatus) {
      result = result.filter((case_) => case_.status === filterStatus)
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)

      if (sortOrder === "asc") {
        return dateA - dateB
      } else {
        return dateB - dateA
      }
    })

    setFilteredCases(result)
  }

  const handleCaseClick = (caseId) => {
    navigate(`/case/${caseId}`)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }

  const clearFilters = () => {
    setFilterState("")
    setFilterCategory("")
    setFilterStatus("")
    setSearchTerm("")
    setSortOrder("desc")
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "in_progress":
        return <AlertCircle className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "closed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Get unique categories and states for filter dropdowns
  const categories = [...new Set(cases.map((case_) => case_.category))]
  const states = [...new Set(cases.map((case_) => extractStateFromAddress(case_.address)))].filter(Boolean)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <button
                onClick={() => navigate("/lawyer-dashboard")}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <Scale className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">JustEase</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium text-gray-600">Loading cases...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <button
                onClick={() => navigate("/lawyer-dashboard")}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <Scale className="w-6 h-6 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">JustEase</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Cases</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchCases}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/lawyer-dashboard")}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
            <div className="flex items-center space-x-2">
              <Scale className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-semibold text-gray-900">JustEase</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Cases</h1>
          <p className="text-gray-600">
            Browse available cases and connect with clients who need your legal expertise.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by victim name, category, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Sort Button */}
            <button
              onClick={toggleSortOrder}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {sortOrder === "desc" ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
              <span>{sortOrder === "desc" ? "Newest First" : "Oldest First"}</span>
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by State</label>
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">All States</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{filteredCases.length}</span> of{" "}
            <span className="font-medium">{cases.length}</span> cases
          </p>
        </div>

        {/* Cases Grid */}
        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Cases Found</h3>
            <p className="text-gray-600 mb-4">
              No cases match your current search criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCases.map((case_) => (
              <div
                key={case_.id}
                onClick={() => handleCaseClick(case_.id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer group"
              >
                {/* Case Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {case_.victim_name}
                    </h3>
                    <p className="text-sm text-gray-600">Case #{case_.id}</p>
                  </div>
                  <div
                    className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${
                      statusColors[case_.status]?.bg || "bg-gray-100"
                    } ${statusColors[case_.status]?.text || "text-gray-800"} ${
                      statusColors[case_.status]?.border || "border-gray-200"
                    }`}
                  >
                    {getStatusIcon(case_.status)}
                    <span className="capitalize">{case_.status?.replace("_", " ")}</span>
                  </div>
                </div>

                {/* Case Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{case_.category}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span>{case_.address}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{case_.mobile_number}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <User className="w-4 h-4 flex-shrink-0" />
                    <span>Filed by: {case_.user_name}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Created: {new Date(case_.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Subcategories */}
                {case_.subcategories && case_.subcategories.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {case_.subcategories.slice(0, 3).map((subcat, index) => (
                        <span
                          key={index}
                          className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
                        >
                          {subcat}
                        </span>
                      ))}
                      {case_.subcategories.length > 3 && (
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{case_.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Hint */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                    Click to view case details →
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if needed for pagination) */}
        {filteredCases.length > 0 && (
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Load More Cases
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExploreCases
