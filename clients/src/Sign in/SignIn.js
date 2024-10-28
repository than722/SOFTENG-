import React, { useState } from 'react';
import './SignIn.css'; // Import the new SignIn styles
import axios from 'axios'; // Import axios for API requests
import { useNavigate } from 'react-router-dom'; // Import navigate hook

const SignIn = ({ isOpen, onClose }) => {
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Initialize navigate

  // Simple validation function
  const Validation = (values) => {
    let errors = {};

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return errors;
  };

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
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    // If there are no validation errors, submit the form
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true); // Set loading state to true when request starts
      axios
        .post('http://localhost:8081/login', values)
        .then((res) => {
          setLoading(false); // Set loading state to false when request completes
          const { id, accountType } = res.data; // Extract id and accountType from response

          // Store token if needed (e.g., res.data.token)
          // localStorage.setItem('token', res.data.token);

          // Redirect to Profile page with user ID and account type
          navigate(`/profile/${accountType}/${id}`);
        })
        .catch((err) => {
          setLoading(false); // Set loading state to false on error
          // Display error message from server response or fallback to a generic one
          const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
          setErrors({ general: errorMessage });
        });
    }
  };

  // Return early if modal is not open
  if (!isOpen) return null;

  return (
    <div className="sign-in-modal-App">
      <div className="sign-in-modal-content-App">
        <span className="sign-in-close-button-App" onClick={onClose}>
          &times;
        </span>
        <h2>Sign In</h2>
        {/* Error message */}
        {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
        <form onSubmit={handleSignInSubmit}>
          <div className="sign-in-form-group-App">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          </div>
          <div className="sign-in-form-group-App">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
          </div>
          <button type="submit" className="sign-in-App" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
