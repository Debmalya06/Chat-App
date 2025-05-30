"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Send, Moon, Sun, Paperclip, X } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import toggleDarkMode from "../darkModeToggle"
import { useChatContext } from '../contex/ChatContex';
import { Client } from '@stomp/stompjs';
import { getMessages } from '../services/RoomServices';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';
import { baseURL } from "../config/AxiosHelper"

export default function ChatPage() {
 const { roomId: contextRoomId, currentUser, connected } = useChatContext();
const navigate = useNavigate();
const location = useLocation();
const userName = location.state?.name || "Guest User";
const roomId = location.state?.roomId || contextRoomId || "Unknown Room";

useEffect(() => {
  if (!connected) {
    navigate("/")
  }
}, [connected, currentUser, roomId]);


  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"))
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const [stompClient, setStompClient] = useState(null)
  // Mock data - in a real app, this would come from props or context

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

  // Remove sample messages logic. Real messages will be loaded from backend.

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
    e.preventDefault();
    if (!message.trim() && !selectedFile) return;

    // Use the same structure as sendMessage for instant UI update
    const newMessage = {
      id: Date.now(),
      sender: userName,
      content: message,
      roomId: roomId,
      timestamp: new Date().toISOString(),
      isSelf: true,
      avatar: generateProfilePic(userName),
      attachment: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size,
        url: URL.createObjectURL(selectedFile)
      } : null
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: newMessage.id,
        sender: newMessage.sender,
        text: newMessage.content,
        isSelf: true,
        timestamp: newMessage.timestamp,
        avatar: newMessage.avatar,
        attachment: newMessage.attachment || null
      }
    ]);

    if (stompClient) {
      stompClient.publish({
        destination: `/app/sendMessage/${roomId}`,
        body: JSON.stringify(newMessage)
      });
    }
    setMessage("");
    setSelectedFile(null);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleAttachClick = () => {
    fileInputRef.current.click()
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    fileInputRef.current.value = ""
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / 1048576).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <div className="w-6 h-6 text-blue-500">📷</div>
    } else if (fileType.startsWith('video/')) {
      return <div className="w-6 h-6 text-red-500">🎬</div>
    } else if (fileType.startsWith('audio/')) {
      return <div className="w-6 h-6 text-green-500">🎵</div>
    } else if (fileType.includes('pdf')) {
      return <div className="w-6 h-6 text-red-700">📄</div>
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <div className="w-6 h-6 text-blue-700">📝</div>
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <div className="w-6 h-6 text-green-700">📊</div>
    } else {
      return <div className="w-6 h-6 text-gray-500">📎</div>
    }
  }

// Page init, load all messages!!
useEffect(() => {
  async function fetchInitialMessages() {
    try {
      const fetchedMessages = await getMessages(roomId, 50, 0);
      // Transform messages to UI format
      const transformed = fetchedMessages.map((msg, idx) => {
        const senderName = msg.sender || "Unknown";
        return {
          id: msg.id || `${msg.timestamp || Date.now()}_${idx}`,
          sender: senderName,
          text: msg.content,
          isSelf: senderName === userName, // userName is current user
          timestamp: msg.timestamp,
          avatar: generateProfilePic(senderName),
        };
      });
      setMessages(transformed);
      console.log("Fetched messages:", transformed);
    } catch (error) {
      toast.error("Failed to load messages");
      console.error(error);
    }
  }
  fetchInitialMessages();
  // eslint-disable-next-line
}, [roomId, userName]);

//activate stomp client and subscribe to the room topic
useEffect(() => {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${baseURL}/chat`),
    reconnectDelay: 5000,
    debug: (str) => console.log(str),
    onConnect: () => {
      setStompClient(client);
      toast.success("Connected to chat server");
      // Subscribe to the correct topic for real-time updates
      client.subscribe(`/topic/messages/${roomId}`, (message) => {
        if (message.body) {
          const msgData = JSON.parse(message.body);
          // Transform incoming message to UI format
          const senderName = msgData.sender || "Unknown";
          const transformedMsg = {
            id: msgData.id || `${msgData.timestamp || Date.now()}_${Math.random()}`,
            sender: senderName,
            text: msgData.content,
            isSelf: senderName === userName,
            timestamp: msgData.timestamp,
            avatar: generateProfilePic(senderName),
          };
          setMessages((prevMessages) => [...prevMessages, transformedMsg]);
        }
      });
    },
    onStompError: (frame) => {
      toast.error("WebSocket error: " + frame.headers["message"]);
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
    onWebSocketError: (evt) => {
      toast.error("WebSocket connection failed");
      console.error("WebSocket error", evt);
    }
  });
  client.activate();

  return () => {
    client.deactivate();
  };
}, [roomId]);

// Remove old sendMessage handler (now handled in handleSendMessage)



const handleLeaveRoom = () => {
  if (stompClient) {
    stompClient.deactivate();
    setStompClient(null);
  }
  setMessages([]);
  setMessage("");
  setSelectedFile(null);
  navigate("/join");
  toast.success("You have left the room.");
};
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
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
          >
            {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-700" />}
          </button>
          <button
            onClick={handleLeaveRoom}
            className="ml-2 px-3 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-colors duration-200"
            title="Leave Room"
          >
            Leave Room
          </button>
        </div>
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
                  ? "bg-purple-700 text-white rounded-br-none"
                  : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"
              }`}
            >
              {!msg.isSelf && <div className="font-semibold text-sm">{msg.sender}</div>}
              {msg.text && <p>{msg.text}</p>}
              
              {/* Attachment display */}
              {msg.attachment && (
                <div className="mt-2">
                  {msg.attachment.type.startsWith('image/') ? (
                    <div className="mt-2">
                      <img 
                        src={msg.attachment.url} 
                        alt={msg.attachment.name}
                        className="max-w-full rounded-md max-h-60 object-contain"
                      />
                      <div className="text-xs mt-1 flex items-center">
                        {getFileIcon(msg.attachment.type)}
                        <span className="ml-1">{msg.attachment.name} ({formatFileSize(msg.attachment.size)})</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-2 bg-opacity-20 bg-gray-200 dark:bg-gray-600 rounded-md">
                      {getFileIcon(msg.attachment.type)}
                      <div className="ml-2 flex-1 overflow-hidden">
                        <div className="text-sm font-medium truncate">{msg.attachment.name}</div>
                        <div className="text-xs">
                          {formatFileSize(msg.attachment.size)}
                        </div>
                      </div>
                      <a 
                        href={msg.attachment.url} 
                        download={msg.attachment.name}
                        className="ml-2 p-1 text-xs bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              )}
              
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

      {/* File Selection Preview */}
      {selectedFile && (
        <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center">
          <div className="flex items-center flex-1 p-2 bg-white dark:bg-gray-700 rounded-md">
            {getFileIcon(selectedFile.type)}
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">
              {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </span>
          </div>
          <button 
            onClick={handleRemoveFile}
            className="ml-2 p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleAttachClick}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <Paperclip size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 py-2 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim() && !selectedFile}
            className={`${
              !message.trim() && !selectedFile 
                ? "bg-blue-300 dark:bg-blue-700 cursor-not-allowed" 
                : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            } text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}