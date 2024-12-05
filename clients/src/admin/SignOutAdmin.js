// SignOutAdmin.js
import React from 'react';

const SignOutAdmin = ({ setIsLoggedIn }) => {
  const handleSignOut = () => {
    localStorage.removeItem('isLoggedIn'); // Remove login state from localStorage
    setIsLoggedIn(false); // Set the login state to false
  };

  return (
    <button onClick={handleSignOut} className="signout-btn">
      Sign Out
    </button>
  );
};

export default SignOutAdmin;
