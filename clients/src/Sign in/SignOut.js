import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignOut.css';

const SignOut = ({ onSignOut }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      // Make a request to your sign-out API endpoint
      await axios.post('http://localhost:8081/signout');
      localStorage.removeItem('authToken'); // Remove the token from local storage
      onSignOut(); // Update authentication state in App (setIsAuthenticated to false)
      navigate('/'); // Redirect to the homepage or login page
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <button className="sign-out-App" onClick={handleSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
