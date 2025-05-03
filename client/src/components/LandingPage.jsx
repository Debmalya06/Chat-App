"use client"
import { useNavigate } from "react-router-dom"
import { MessageSquare, Users, Shield, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    navigate("/join")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 dark:text-white mb-6">
            Welcome to <span className="text-blue-500">Room Chat</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10">
            Connect with friends, colleagues, or meet new people in real-time chat rooms. Create your own room or join
            existing ones with a simple click.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg flex items-center gap-2 transform hover:scale-105 transition-all duration-200"
          >
            Get Started
            <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">Why Choose Room Chat?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-3">
              Real-time Messaging
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Enjoy seamless, instant messaging with no delays. Connect with others as if you're in the same room.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-3">Private Rooms</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Create private rooms for your team, friends, or community. Share room IDs only with those you want to
              invite.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-white mb-3">
              Secure Communication
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Your conversations are private and secure. We prioritize your privacy and data protection.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-500 dark:text-gray-400">&copy;2025 Room Chat App. All rights reserved.</p>
      </footer>
    </div>
  )
}
