import React, { useState, useEffect } from 'react';
import './Admin.css';
import logo from '../assets/images/MMMLCropped.png';

const LoginAdmin = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const correctUsername = 'admin';
  const correctPassword = 'admin';

  // Check if the user is already logged in by checking localStorage
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true); // Set login state if found in localStorage
    }
  }, [setIsLoggedIn]);

  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true'); // Save login state to localStorage
    } else {
      setError('Incorrect username or password');
    }
  };

  return (
    <div className="login-form">
      <img src={logo} alt="Logo" className="admin-logo" />
      <h2 className='admin-Log'>Admin Login</h2>
      <input className='username'
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        aria-label="Username"
      />
      <input className='password'
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password"
      />
      <button className='admin-login-button' onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginAdmin;
