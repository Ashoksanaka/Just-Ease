"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Scale,
  LogOut,
  Search,
  Bell,
  User,
  FileText,
  MessageSquare,
  Calendar,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  Menu,
  X,
  Home,
  Settings,
  HelpCircle,
} from "lucide-react"

const LawyerDashBoard = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard")

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "{}")

    if (!token) {
      navigate("/lawyer")
      return
    }

    // Set user data from localStorage
    setUserData(user)
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token")
    localStorage.removeItem("refresh")
    localStorage.removeItem("user")
    navigate("/lawyer")
  }

  const handleExploreCases = () => {
    setActiveMenuItem("explore")
    navigate("/explore-cases/")
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
      id: "explore",
      label: "Explore Cases",
      icon: Search,
      action: handleExploreCases,
    },
    {
      id: "messages",
      label: "Messages",
      icon: MessageSquare,
      action: () => console.log("Messages clicked"),
      badge: "8",
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      action: () => console.log("Calendar clicked"),
    },
    {
      id: "clients",
      label: "Clients",
      icon: Users,
      action: () => console.log("Clients clicked"),
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      action: () => console.log("Settings clicked"),
    },
  ]

  const stats = [
    { label: "Active Cases", value: "12", icon: <FileText className="w-5 h-5" />, color: "blue" },
    { label: "New Messages", value: "8", icon: <MessageSquare className="w-5 h-5" />, color: "green" },
    { label: "Appointments", value: "5", icon: <Calendar className="w-5 h-5" />, color: "purple" },
    { label: "Success Rate", value: "94%", icon: <TrendingUp className="w-5 h-5" />, color: "orange" },
  ]

  const recentActivities = [
    { type: "case", title: "New case assigned: Domestic Violence", time: "2 hours ago", status: "new" },
    { type: "message", title: "Message from Sarah Johnson", time: "4 hours ago", status: "unread" },
    { type: "appointment", title: "Consultation scheduled for tomorrow", time: "1 day ago", status: "scheduled" },
    { type: "case", title: "Case closed: Property Dispute", time: "2 days ago", status: "completed" },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-gray-600">Loading your dashboard...</span>
        </div>
      </div>
    )
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
            <Scale className="w-8 h-8 text-blue-600" />
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
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                      isActive ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-blue-900">Need Help?</p>
              <p className="text-xs text-blue-700 truncate">Contact support</p>
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
                className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-gray-900 truncate">Dashboard</h1>
                <p className="text-sm text-gray-500 hidden sm:block">Legal Professional Portal</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
              {/* Notifications */}
              <button
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile Section */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {userData?.first_name && userData?.last_name
                      ? `${userData.first_name} ${userData.last_name}`
                      : userData?.email || "User"}
                  </p>
                  <p className="text-xs text-gray-500">Legal Professional</p>
                </div>

                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {userData?.first_name || "Counselor"}!
            </h2>
            <p className="text-gray-600">Here's what's happening with your cases and clients today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-${stat.color}-600`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={handleExploreCases}
                    className="w-full flex items-center justify-between p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Search className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Explore New Cases</span>
                    </div>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900">View Messages</span>
                    </div>
                  </button>

                  <button className="w-full flex items-center justify-between p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Schedule Meeting</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.status === "new"
                            ? "bg-blue-100 text-blue-600"
                            : activity.status === "unread"
                              ? "bg-green-100 text-green-600"
                              : activity.status === "scheduled"
                                ? "bg-purple-100 text-purple-600"
                                : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {activity.type === "case" ? (
                          <FileText className="w-4 h-4" />
                        ) : activity.type === "message" ? (
                          <MessageSquare className="w-4 h-4" />
                        ) : activity.type === "appointment" ? (
                          <Calendar className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LawyerDashBoard
