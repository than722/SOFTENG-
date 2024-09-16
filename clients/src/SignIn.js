import React, { useState } from 'react';
import './SignIn.css'; // Import the new SignIn styles

const SignIn = ({ isOpen, onClose }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSignInSubmit = (event) => {
    event.preventDefault();
    
    // Perform sign-in logic here with axios, etc.
    console.log('Sign In submitted:', values);

    // Reset modal state after submission
    setError('');
    onClose();
  };

  // Return early if modal is not open
  if (!isOpen) return null;

  return (
    <div className="sign-in-modal-App">
      <div className="sign-in-modal-content-App">
        <span className="sign-in-close-button-App" onClick={onClose}>&times;</span>
        <h2>Sign In</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
        <form onSubmit={handleSignInSubmit}>
          <div className="sign-in-form-group-App">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="sign-in-form-group-App">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="sign-in-App">Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
