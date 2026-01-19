"use client"
import { useNavigate } from "react-router-dom"
import { MessageSquare, Users, Shield, ArrowRight, Zap, Globe, Heart, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleGetStarted = () => {
    navigate("/join")
  }

  // Floating chat bubbles data
  const chatBubbles = [
    { emoji: "👋", text: "Hey there!", delay: "0s", position: "top-20 left-10" },
    { emoji: "😊", text: "Welcome!", delay: "0.5s", position: "top-32 right-20" },
    { emoji: "🎉", text: "Let's chat!", delay: "1s", position: "bottom-40 left-20" },
    { emoji: "💬", text: "Join us!", delay: "1.5s", position: "bottom-32 right-10" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-gray-900 transition-colors duration-500 overflow-hidden relative">
      
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
            top: '50%', 
            left: '50%',
            animationDelay: '2s'
          }}
        />
      </div>

      {/* Floating Chat Bubbles */}
      {chatBubbles.map((bubble, index) => (
        <div
          key={index}
          className={`absolute ${bubble.position} hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-lg animate-bounce`}
          style={{ animationDelay: bubble.delay, animationDuration: '3s' }}
        >
          <span className="text-2xl">{bubble.emoji}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{bubble.text}</span>
        </div>
      ))}

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RoomChat
            </span>
          </div>
          <button
            onClick={handleGetStarted}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-800 dark:text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 pt-12 pb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Now with real-time messaging</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
              Connect.{" "}
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                Chat.
              </span>{" "}
              <br />
              Collaborate.
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl mb-8 leading-relaxed">
              Create instant chat rooms, invite your friends, and start conversations that matter. 
              No sign-up required – just create a room and share the code!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={handleGetStarted}
                className="group bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center justify-center gap-2 hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Start Chatting Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-gray-800 dark:text-white font-semibold py-4 px-8 rounded-full text-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">10K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">50K+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Rooms Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">99.9%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Chat Preview */}
          <div className="flex-1 relative">
            <div className="relative w-full max-w-md mx-auto">
              {/* Phone Frame */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] overflow-hidden">
                  {/* Chat Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Team Chat</div>
                      <div className="text-white/70 text-xs">4 members online</div>
                    </div>
                  </div>
                  
                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-[300px]">
                    <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm max-w-[200px]">
                        <p className="text-sm text-gray-800 dark:text-gray-200">Hey everyone! 👋</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">B</div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm max-w-[200px]">
                        <p className="text-sm text-gray-800 dark:text-gray-200">Welcome to the room! 🎉</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl rounded-tr-sm px-4 py-2 shadow-sm max-w-[200px]">
                        <p className="text-sm text-white">Thanks! Excited to be here 😊</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">C</div>
                      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm">
                        <p className="text-sm text-gray-800 dark:text-gray-200">Let's get started! 🚀</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chat Input */}
                  <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-transparent text-sm outline-none text-gray-600 dark:text-gray-300"
                        disabled
                      />
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                <span className="text-3xl">💬</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                <span className="text-2xl">✨</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">connect</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to make your conversations seamless and enjoyable
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Zap, title: "Lightning Fast", desc: "Real-time messaging with zero lag", color: "from-yellow-400 to-orange-500", emoji: "⚡" },
            { icon: Shield, title: "Secure & Private", desc: "End-to-end encrypted conversations", color: "from-green-400 to-emerald-500", emoji: "🔒" },
            { icon: Users, title: "Group Rooms", desc: "Create rooms for any size team", color: "from-blue-400 to-cyan-500", emoji: "👥" },
            { icon: Globe, title: "Access Anywhere", desc: "Works on all devices & browsers", color: "from-purple-400 to-pink-500", emoji: "🌍" },
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <span className="text-2xl">{feature.emoji}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start chatting?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of users who are already connecting through RoomChat. 
              Create your first room in seconds!
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-white text-purple-600 font-bold py-4 px-10 rounded-full text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Loved by users worldwide 💖
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Sarah K.", role: "Product Manager", text: "RoomChat made our remote team communication so much easier. We use it daily!", avatar: "👩‍💼" },
            { name: "Mike T.", role: "Developer", text: "Simple, fast, and just works. Exactly what I needed for quick team discussions.", avatar: "👨‍💻" },
            { name: "Emily R.", role: "Designer", text: "Love the clean interface! It's so easy to create rooms and invite collaborators.", avatar: "👩‍🎨" },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-full flex items-center justify-center text-2xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.text}"</p>
              <div className="flex gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RoomChat
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-purple-500 transition-colors">Contact</a>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            © 2026 RoomChat. Made with <Heart className="w-4 h-4 inline text-red-500" /> 
          </p>
        </div>
      </footer>

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
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
          opacity: 0;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease forwards;
        }
      `}</style>
    </div>
  )
}
