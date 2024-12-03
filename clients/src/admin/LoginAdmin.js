import React, { useState } from 'react';
import './Admin.css';

const LoginAdmin = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const correctUsername = 'admin';
  const correctPassword = 'admin';

  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      setIsLoggedIn(true);
    } else {
      setError('Incorrect username or password');
    }
  };

  return (
    <div className="login-form">
      <h2>Admin Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        aria-label="Username"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginAdmin;
