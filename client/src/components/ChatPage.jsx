"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Moon, Sun } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import toggleDarkMode from "../darkModeToggle"

export default function ChatPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"))
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const messagesEndRef = useRef(null)

  // Mock data - in a real app, this would come from props or context
  const userName = location.state?.name || "Guest User"
  const roomId = location.state?.roomId || "Unknown Room"
  
  // Generate profile picture based on name
  const generateProfilePic = (name) => {
    // Create initials from name (max 2 characters)
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    
    // Generate a consistent hue value based on the name
    const nameSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const hue = nameSum % 360; // 0-359 range for HSL hue
    
    // Create a placeholder URL with initials and background color
    // Using the actual placeholder API that works in this environment
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}`;
  }

  // Sample messages for demonstration
  useEffect(() => {
    const sampleMessages = [
      {
        id: 1,
        sender: "John Doe",
        text: "Hey everyone! Welcome to the room.",
        isSelf: false,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        avatar: generateProfilePic("John Doe")
      },
      {
        id: 2,
        sender: userName,
        text: "Thanks for having me!",
        isSelf: true,
        timestamp: new Date(Date.now() - 3000000).toISOString(),
        avatar: generateProfilePic(userName)
      },
      {
        id: 3,
        sender: "Sarah Kim",
        text: "How is everyone doing today?",
        isSelf: false,
        timestamp: new Date(Date.now() - 2400000).toISOString(),
        avatar: generateProfilePic("Sarah Kim")
      },
      {
        id: 4,
        sender: "Mike Johnson",
        text: "I'm doing great! Excited to chat with you all.",
        isSelf: false,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        avatar: generateProfilePic("Mike Johnson")
      },
      {
        id: 5,
        sender: userName,
        text: "I'm good too. What are we discussing today?",
        isSelf: true,
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        avatar: generateProfilePic(userName)
      },
    ]

    setMessages(sampleMessages)
  }, [userName])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleToggleDarkMode = () => {
    toggleDarkMode()
    setIsDarkMode(!isDarkMode)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: Date.now(),
      sender: userName,
      text: message,
      isSelf: true,
      timestamp: new Date().toISOString(),
      avatar: generateProfilePic(userName)
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      {/* Navbar */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/join")}
            className="mr-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center">
            <img 
              src={generateProfilePic(userName)} 
              alt={`${userName}'s avatar`}
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">{roomId}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">You are chatting as {userName}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleToggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-700" />}
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isSelf ? "justify-end" : "justify-start"}`}>
            {/* Avatar for non-self messages */}
            {!msg.isSelf && (
              <div className="flex-shrink-0 mr-2">
                <img 
                  src={msg.avatar} 
                  alt={`${msg.sender}'s avatar`} 
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
            
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 ${
                msg.isSelf
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"
              }`}
            >
              {!msg.isSelf && <div className="font-semibold text-sm">{msg.sender}</div>}
              <p>{msg.text}</p>
              <div className={`text-xs mt-1 ${msg.isSelf ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                {formatTime(msg.timestamp)}
              </div>
            </div>
            
            {/* Avatar for self messages */}
            {msg.isSelf && (
              <div className="flex-shrink-0 ml-2">
                <img 
                  src={msg.avatar} 
                  alt="Your avatar" 
                  className="w-8 h-8 rounded-full" 
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}