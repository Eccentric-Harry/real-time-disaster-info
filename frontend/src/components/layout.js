// Layout.js
import React from 'react';
import Navbar from '../components/Navbar/Navbar'; // Adjust path as needed
import { Outlet } from 'react-router-dom';
import DashFooter from './dashFooter';
import Chatbot from '../components/Chatbot'; // Import the Chatbot component

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* This is where nested routes will be rendered */}
      </main>
      <DashFooter />
      <Chatbot /> {/* Add Chatbot here */}
    </div>
  );
};

export default Layout;
