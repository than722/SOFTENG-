// SignOut.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignOut = ({ onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await axios.post('http://localhost:8081/signout'); // Your sign-out endpoint
      localStorage.removeItem('authToken'); // Remove token from local storage
      onSignOut(); // Update authentication state
      navigate('/'); // Redirect to the homepage or login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOut;
