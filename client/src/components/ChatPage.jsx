"use client"

import { useState, useEffect, useRef } from "react"
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { ArrowLeft, Send, Moon, Sun, Paperclip, X, Users, MessageSquare, LogOut, Smile } from "lucide-react"
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + (emoji.native || ''));
    setShowEmojiPicker(false);
  };
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const [stompClient, setStompClient] = useState(null)

  // Generate profile picture with gradient colors
  const generateProfilePic = (name) => {
    const initials = name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff&bold=true`;
  }

  // Generate consistent gradient color based on name
  const getGradientColor = (name) => {
    const gradients = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-green-500',
    ];
    const nameSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return gradients[nameSum % gradients.length];
  }

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

  // Page init, load all messages
  useEffect(() => {
    async function fetchInitialMessages() {
      try {
        const fetchedMessages = await getMessages(roomId, 50, 0);
        const transformed = fetchedMessages.map((msg, idx) => {
          const senderName = msg.sender || "Unknown";
          return {
            id: msg.id || `${msg.timestamp || Date.now()}_${idx}`,
            sender: senderName,
            text: msg.content,
            isSelf: senderName === userName,
            timestamp: msg.timestamp,
            avatar: generateProfilePic(senderName),
          };
        });
        setMessages(transformed);
      } catch (error) {
        toast.error("Failed to load messages");
        console.error(error);
      }
    }
    fetchInitialMessages();
  }, [roomId, userName]);

  // Activate stomp client
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(`${baseURL}/chat`),
      reconnectDelay: 5000,
      debug: (str) => console.log(str),
      onConnect: () => {
        setStompClient(client);
        toast.success("Connected to chat server 🎉");
        client.subscribe(`/topic/messages/${roomId}`, (message) => {
          if (message.body) {
            const msgData = JSON.parse(message.body);
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
      },
      onWebSocketError: (evt) => {
        toast.error("WebSocket connection failed");
      }
    });
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  const handleLeaveRoom = () => {
    if (stompClient) {
      stompClient.deactivate();
      setStompClient(null);
    }
    setMessages([]);
    setMessage("");
    setSelectedFile(null);
    navigate("/join");
    toast.success("You have left the room 👋");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 transition-colors duration-500">
      
      {/* Navbar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/join")}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getGradientColor(roomId)} flex items-center justify-center shadow-lg`}>
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  {roomId}
                  <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full">Live</span>
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Chatting as <span className="font-medium text-purple-600 dark:text-purple-400">{userName}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleDarkMode}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-600" />}
            </button>
            <button
              onClick={handleLeaveRoom}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No messages yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Be the first to say hello! 👋</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.isSelf ? "justify-end" : "justify-start"} animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Avatar for others */}
              {!msg.isSelf && (
                <div className="flex-shrink-0 mr-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradientColor(msg.sender)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}

              <div className={`max-w-xs md:max-w-md lg:max-w-lg ${msg.isSelf ? 'order-1' : ''}`}>
                {/* Sender name for others */}
                {!msg.isSelf && (
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">{msg.sender}</p>
                )}
                
                <div
                  className={`rounded-2xl px-4 py-3 shadow-md ${
                    msg.isSelf
                      ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-br-sm"
                      : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white rounded-bl-sm border border-gray-100 dark:border-gray-700"
                  }`}
                >
                  {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                  {/* Attachment display */}
                  {msg.attachment && (
                    <div className="mt-2">
                      {msg.attachment.type.startsWith('image/') ? (
                        <div className="mt-2">
                          <img
                            src={msg.attachment.url}
                            alt={msg.attachment.name}
                            className="max-w-full rounded-xl max-h-60 object-contain"
                          />
                          <div className="text-xs mt-1 flex items-center opacity-80">
                            {getFileIcon(msg.attachment.type)}
                            <span className="ml-1">{msg.attachment.name} ({formatFileSize(msg.attachment.size)})</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center p-2 bg-black/10 dark:bg-white/10 rounded-xl">
                          {getFileIcon(msg.attachment.type)}
                          <div className="ml-2 flex-1 overflow-hidden">
                            <div className="text-sm font-medium truncate">{msg.attachment.name}</div>
                            <div className="text-xs opacity-70">{formatFileSize(msg.attachment.size)}</div>
                          </div>
                          <a
                            href={msg.attachment.url}
                            download={msg.attachment.name}
                            className="ml-2 px-3 py-1 text-xs bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className={`text-xs mt-2 ${msg.isSelf ? "text-white/70" : "text-gray-400"}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>

              {/* Avatar for self */}
              {msg.isSelf && (
                <div className="flex-shrink-0 ml-3 order-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradientColor(msg.sender)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* File Selection Preview */}
      {selectedFile && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl px-4 py-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-4xl mx-auto flex items-center">
            <div className="flex items-center flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              {getFileIcon(selectedFile.type)}
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </span>
            </div>
            <button
              onClick={handleRemoveFile}
              className="ml-3 p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        {/* Emoji Picker Popup */}
        {showEmojiPicker && (
          <div className="absolute bottom-24 left-4 md:left-auto md:right-1/4 z-50 shadow-2xl rounded-2xl overflow-hidden">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme={isDarkMode ? 'dark' : 'light'} />
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700/50 rounded-2xl p-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleAttachClick}
              className="p-3 text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-300"
              title="Attach file"
            >
              <Paperclip size={20} />
            </button>
            <button
              type="button"
              onClick={() => setShowEmojiPicker((v) => !v)}
              className={`p-3 text-gray-500 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-all duration-300 ${showEmojiPicker ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500' : ''}`}
              title="Emoji picker"
            >
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 py-3 px-4 bg-transparent text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!message.trim() && !selectedFile}
              className={`p-3 rounded-xl transition-all duration-300 ${
                !message.trim() && !selectedFile
                  ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-lg hover:scale-105"
              } text-white`}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease forwards;
        }
      `}</style>
    </div>
  )
}