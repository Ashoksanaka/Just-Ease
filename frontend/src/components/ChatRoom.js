"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import connectWebSocket from "../utils/socket"
import { Send, ArrowLeft, MessageSquare, User, Clock, Shield, Phone, AlertCircle, CheckCircle } from "lucide-react"

const ChatRoom = ({ roomName }) => {
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/victim-login")
      return
    }

    const user = localStorage.getItem("user")
    if (user) {
      try {
        setCurrentUser(JSON.parse(user))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }

    const ws = connectWebSocket(roomName)
    setSocket(ws)

    ws.onopen = () => {
      console.log("WebSocket Connected")
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("Message received:", data)
      setMessages((prevMessages) => [...prevMessages, { ...data, timestamp: new Date() }])
    }

    ws.onclose = () => {
      console.log("WebSocket Disconnected")
      setIsConnected(false)
    }

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error)
      setIsConnected(false)
    }

    return () => {
      if (ws) {
        ws.close()
      }
    }
  }, [roomName, navigate])

  const sendMessage = () => {
    if (socket && message.trim() && isConnected) {
      const username = currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : "User"
      socket.send(JSON.stringify({ message: message.trim(), username }))
      setMessage("")
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const isOwnMessage = (messageUsername) => {
    if (!currentUser) return false
    const currentUsername = `${currentUser.first_name} ${currentUser.last_name}`
    return messageUsername === currentUsername
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/victim-dashboard")}
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-6 h-6 text-green-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Chat Room: {roomName}</h1>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="text-xs text-gray-500">{isConnected ? "Connected" : "Disconnected"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="text-red-700 text-sm">
              <p className="font-medium">Connection Lost</p>
              <p>Trying to reconnect to the chat room...</p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-green-800 text-sm">
              <p className="font-medium mb-1">Secure Chat Room</p>
              <p>
                This is a secure, encrypted chat room. All messages are confidential and protected. If you need
                immediate assistance, please call emergency services.
              </p>
            </div>
          </div>

          {/* Messages */}
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-600">Start the conversation by sending a message below.</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${isOwnMessage(msg.username) ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    isOwnMessage(msg.username)
                      ? "bg-green-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  {!isOwnMessage(msg.username) && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-blue-600" />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{msg.username}</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  <div
                    className={`flex items-center justify-end space-x-1 mt-2 ${
                      isOwnMessage(msg.username) ? "text-green-100" : "text-gray-500"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{formatTime(msg.timestamp)}</span>
                    {isOwnMessage(msg.username) && <CheckCircle className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type your message..." : "Connecting..."}
                disabled={!isConnected}
                rows="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                style={{ minHeight: "48px", maxHeight: "120px" }}
                onInput={(e) => {
                  e.target.style.height = "auto"
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px"
                }}
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!message.trim() || !isConnected}
              className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Typing Indicator */}
          {isTyping && (
            <div className="mt-2 text-xs text-gray-500 flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span>Someone is typing...</span>
            </div>
          )}
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-red-50 border-t border-red-200 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 text-red-700">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Emergency: 911</span>
          </div>
          <div className="text-gray-300">|</div>
          <div className="flex items-center space-x-2 text-red-700">
            <Phone className="w-4 h-4" />
            <span className="font-medium">Crisis Helpline: 1-800-799-7233</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom
