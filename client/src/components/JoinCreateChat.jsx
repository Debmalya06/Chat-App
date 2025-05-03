import { useState, useEffect } from 'react';
import toggleDarkMode from '../darkModeToggle';

export default function ChatApp() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const handleToggleDarkMode = () => {
    toggleDarkMode();
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = () => {
    if (!name || !roomId) {
      alert('Please enter both name and room ID');
      return;
    }
    // Here you would implement your logic for joining a room
    alert(`Name: ${name}, Room ID: ${roomId}`);
  };

  const handleCreateRoom = () => {
    if (!name) {
      alert('Please enter your name');
      return;
    }
    // Logic for creating a new room
    alert(`Creating new room for ${name}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white ml-5">Room Chat</h1>
          <button
            onClick={handleToggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-200 mr-5"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 transition-colors duration-200">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="roomId">
              Room ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white dark:bg-gray-700 dark:border-gray-600 leading-tight focus:outline-none focus:shadow-outline"
              id="roomId"
              type="text"
              placeholder="Enter room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              type="button"
              onClick={handleSubmit}
            >
              Join Room
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              type="button"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
          </div>
        </div>
        <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
          &copy;2025 Room Chat App. All rights reserved.
        </p>
      </div>
    </div>
  );
}