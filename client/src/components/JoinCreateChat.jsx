import { useState, useEffect } from 'react';
import { MessageSquare, Users, Plus, ArrowRight, Sparkles, Moon, Sun, Home } from 'lucide-react';
import toggleDarkMode from '../darkModeToggle';
import toast from 'react-hot-toast';
import { createRoom as createRoomApi } from '../services/RoomServices';
import { useChatContext } from '../contex/ChatContex';
import { useNavigate } from 'react-router-dom';
import { joinChatApi } from '../services/RoomServices';

export default function ChatApp() {
  const [detail, setDetail] = useState({
    username: '',
    roomId: ''
  });
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [activeTab, setActiveTab] = useState('join'); // 'join' or 'create'
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    setIsDarkMode(!isDarkMode);
  };

  const { roomId, currentUser, setRoomId, setCurrentUser, setconnected } = useChatContext();
  const navigate = useNavigate();

  const handleFormInputChange = (event) => {
    setDetail({
      ...detail,
      [event.target.name]: event.target.value,
    });
  };

  function validateForm() {
    if (!detail.username || !detail.roomId) {
      toast.error('Please fill in all fields!');
      return false;
    }
    return true;
  }

  async function joinChat() {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const room = await joinChatApi(detail.roomId);
        toast.success("Joined the room successfully! 🎉");
        setCurrentUser(detail.username);
        setRoomId(room.roomId);
        setconnected(true);
        navigate(`/chat`, { state: { name: detail.username, roomId: detail.roomId } });
      } catch (error) {
        if (error.response && error.response.status === 404) {
          toast.error("Room not found 😕");
        } else if (error.response && error.response.status === 400) {
          toast.error("Invalid Room ID");
        } else {
          toast.error("Error joining chat");
        }
        console.error("Error joining chat:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function createRoom() {
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await createRoomApi(detail.roomId);
        if (response?.message === "Room Already Exists") {
          toast.error("Room Already Exists!");
        } else {
          toast.success("Room created successfully! 🚀");
          setCurrentUser(detail.username);
          setRoomId(detail.roomId);
          setconnected(true);
          navigate(`/chat`, { state: { name: detail.username, roomId: detail.roomId } });
        }
      } catch (error) {
        if (error.status === 400) {
          toast.error("Room Already Exists!");
        } else {
          toast.error(error.message || "Error creating room");
        }
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 transition-colors duration-500 overflow-hidden relative flex items-center justify-center">
      
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div
          className="absolute w-80 h-80 bg-gradient-to-r from-pink-400/30 to-orange-400/30 rounded-full blur-3xl animate-pulse"
          style={{
            bottom: '20%',
            right: '10%',
            animationDelay: '1s',
            transform: `translate(${-mousePosition.x * 0.015}px, ${-mousePosition.y * 0.015}px)`
          }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-green-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            top: '60%',
            left: '60%',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg animate-bounce" style={{ animationDuration: '3s' }}>
        <span className="text-2xl">💬</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Chat Now!</span>
      </div>
      <div className="absolute bottom-20 right-10 hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
        <span className="text-2xl">🚀</span>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Get Started</span>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RoomChat
            </span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
              title="Go Home"
            >
              <Home className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              onClick={handleToggleDarkMode}
              className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Start chatting in seconds</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            {activeTab === 'join' ? 'Join a Room' : 'Create a Room'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {activeTab === 'join' ? 'Enter room details to start chatting' : 'Create your own chat room'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-gray-100 dark:border-gray-700">
          
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-2xl p-1 mb-8">
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'join'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <Users className="w-5 h-5" />
              Join Room
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
              Create Room
            </button>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Your Name
              </label>
              <div className="relative">
                <input
                  className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 placeholder-gray-400"
                  type="text"
                  placeholder="Enter your display name"
                  name="username"
                  value={detail.username}
                  onChange={handleFormInputChange}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">👤</div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Room ID
              </label>
              <div className="relative">
                <input
                  className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-white rounded-xl border-2 border-transparent focus:border-purple-500 dark:focus:border-purple-400 focus:outline-none transition-all duration-300 placeholder-gray-400"
                  type="text"
                  placeholder={activeTab === 'join' ? 'Enter room ID to join' : 'Create a unique room ID'}
                  name="roomId"
                  value={detail.roomId}
                  onChange={handleFormInputChange}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xl">🔑</div>
              </div>
            </div>

            <button
              onClick={activeTab === 'join' ? joinChat : createRoom}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                activeTab === 'join'
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:shadow-purple-500/25'
                  : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:shadow-xl hover:shadow-green-500/25'
              }`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {activeTab === 'join' ? 'Join Room' : 'Create Room'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2">
              <span className="text-lg">💡</span>
              <span>
                {activeTab === 'join'
                  ? 'Ask your friend for the Room ID to join their chat room instantly!'
                  : 'Share your Room ID with friends so they can join your conversation!'}
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          © 2026 RoomChat. Made with ❤️
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}