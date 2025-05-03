// filepath: d:\Web_Dev\WEB_Project\Chat-App\client\src\config\routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Correct imports
import LandingPage from '../components/LandingPage.jsx';
import JoinCreateChat from '../components/JoinCreateChat.jsx';
import ChatPage from '../components/ChatPage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/join" element={<JoinCreateChat />} />
      <Route path="/chat" element={<ChatPage />} />

    </Routes>
  );
};

export default AppRoutes;