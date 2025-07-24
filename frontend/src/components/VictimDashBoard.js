"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Shield,
  Plus,
  FileText,
  Calendar,
  MessageSquare,
  Heart,
  LogOut,
  User,
  Bell,
  Menu,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Home,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react"

const VictimDashBoard = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [cases, setCases] = useState([])
  const [loadingCases, setLoadingCases] = useState(true)
  const [casesError, setCasesError] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token) {
      navigate("/victim")
      return
    }

    if (user) {
      try {
        setUserData(JSON.parse(user))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    const fetchCases = async () => {
      setLoadingCases(true)
      setCasesError(null)
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cases/list-cases/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setCases(response.data)
      } catch (err) {
        console.error("Error fetching cases:", err)
        setCasesError(err.response?.data?.message || "Failed to fetch cases.")
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          localStorage.removeItem("refresh")
        }
      } finally {
        setLoadingCases(false)
      }
    }

    fetchCases()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("refresh")
    navigate("/victim")
  }

  const handleCreateCase = () => {
    setActiveMenuItem("create-case")
    navigate("/create-case")
  }

  const handleMenuClick = (menuItem, action = null) => {
    setActiveMenuItem(menuItem)
    setSidebarOpen(false) // Close mobile sidebar
    if (action) action()
  }

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      action: () => {},
      active: true,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      action: () => console.log("Messages clicked"),
      badge: "3",
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      action: () => console.log("Appointments clicked"),
    },
    {
      id: "resources",
      label: "Support Resources",
      icon: Heart,
      action: () => console.log("Resources clicked"),
    },
    {
      id: "documents",
      label: "Documents",
      icon: BookOpen,
      action: () => console.log("Documents clicked"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      action: () => console.log("Settings clicked"),
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in_progress":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          fixed inset-y-0 left-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:fixed lg:inset-y-0 lg:left-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">JustEase</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            const isActive = activeMenuItem === item.id

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.action)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-green-50 text-green-700 border-r-2 border-green-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                      isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Emergency Contact Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Emergency</span>
            </div>
            <p className="text-xs text-red-700">If you're in immediate danger, call 911</p>
            <p className="text-xs text-red-700 mt-1">Crisis Helpline: 1-800-799-7233</p>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-900">Need Support?</p>
              <p className="text-xs text-green-700 truncate">We're here to help</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            {/* Left Section */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-gray-900 truncate">Dashboard</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Safe Space Portal</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
              {/* Notifications */}
              <button
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              </button>

              {/* User Profile Section */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {userData?.first_name && userData?.last_name
                      ? `${userData.first_name} ${userData.last_name}`
                      : userData?.email || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Protected User</p>
                </div>

                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6" />
                <h2 className="text-2xl font-bold">Welcome{userData?.first_name ? `, ${userData.first_name}` : ""}</h2>
              </div>
              <p className="text-green-100 mb-4">
                You're in a safe space. We're here to support you through your legal journey and connect you with the
                help you deserve.
              </p>
              <button
                onClick={handleCreateCase}
                className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>File a New Case</span>
              </button>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cases Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Your Cases</h3>
                  <button
                    onClick={handleCreateCase}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Case</span>
                  </button>
                </div>

                {loadingCases ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600">Loading your cases...</span>
                    </div>
                  </div>
                ) : casesError ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="text-red-700 text-sm">{casesError}</div>
                  </div>
                ) : cases.length > 0 ? (
                  <div className="space-y-4">
                    {cases.map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">Case #{caseItem.id}</h4>
                            <p className="text-sm text-gray-600">Victim: {caseItem.victim_name}</p>
                          </div>
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}
                          >
                            {getStatusIcon(caseItem.status)}
                            <span className="capitalize">{caseItem.status?.replace("_", " ")}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            <strong>Category:</strong> {caseItem.category}
                          </p>
                          <p>
                            <strong>Created:</strong> {new Date(caseItem.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Cases Yet</h4>
                    <p className="text-gray-600 mb-4">
                      You haven't filed any cases yet. When you're ready, we're here to help.
                    </p>
                    <button
                      onClick={handleCreateCase}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      File Your First Case
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Support Resources */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleCreateCase}
                    className="w-full flex items-center space-x-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">File New Case</span>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">View Messages</span>
                  </button>

                  <button className="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Schedule Consultation</span>
                  </button>
                </div>
              </div>

              {/* Support Resources */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Resources</h3>
                <div className="space-y-3 text-sm">
                  <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="font-medium text-gray-900">Legal Aid Information</div>
                    <div className="text-gray-600">Free legal assistance programs</div>
                  </a>
                  <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="font-medium text-gray-900">Victim Support Services</div>
                    <div className="text-gray-600">Counseling and support groups</div>
                  </a>
                  <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="font-medium text-gray-900">Document Templates</div>
                    <div className="text-gray-600">Legal forms and templates</div>
                  </a>
                  <a href="#" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="font-medium text-gray-900">FAQ</div>
                    <div className="text-gray-600">Common questions answered</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default VictimDashBoard
