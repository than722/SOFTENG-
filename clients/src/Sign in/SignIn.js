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
  
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      let accountType; // Declare accountType outside the promise chain
  
      axios
        .post('http://localhost:8081/login', values)
        .then((res) => {
          setLoading(false);
          console.log('Login response:', res.data); // Log the response to check its structure
          const { id, accountType: fetchedAccountType } = res.data;
          accountType = fetchedAccountType; // Assign the fetched accountType to the variable
  
          // Check if accountType is defined
          if (!accountType) {
            setErrors({ general: 'Account type is missing from the response.' });
            return; // Exit if accountType is not defined
          }
  
          // Check if user exists in the respective table
          return axios.get(`http://localhost:8081/checkUser/${accountType}/${id}`);
        })
        .then((checkRes) => {
          // Navigate to the Profile page if the user is found
          const { found, profileId } = checkRes.data;
          if (found) {
            navigate(`/profile/${accountType}/${profileId}`);
          } else {
            setErrors({ general: 'User profile not found.' });
          }
        })
        .catch((err) => {
          setLoading(false);
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
