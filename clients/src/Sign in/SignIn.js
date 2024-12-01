import React, { useState, useEffect } from 'react';
import './SignIn.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ isOpen, onClose, setAuth }) => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Reset form values when the modal is closed
  useEffect(() => {
    if (!isOpen) {
      setValues({ email: '', password: '' });
      setErrors({});
    }
  }, [isOpen]);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;

    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      try {
        const res = await axios.post('http://localhost:8081/login', values);
        setLoading(false);

        const { userType, userId, authToken } = res.data;

        if (authToken) {
          localStorage.setItem('authToken', authToken);
          console.log('Auth token saved to localStorage');
        }

        if (userType) {
          localStorage.setItem('userType', userType);
        }

        if (userId) {
          localStorage.setItem('userId', userId);
        }

        setAuth(true);
        onClose(); // Close the modal after successful login

        if (userType === 'employee') {
          navigate(`/employee/${userId}`);
        } else if (userType === 'employer') {
          navigate(`/employer/${userId}`);
        } else {
          setErrors({ general: 'Unexpected user type.' });
        }
      } catch (err) {
        setLoading(false);
        if (err.response) {
          setErrors({ general: err.response.data.error || 'Invalid credentials. Please try again.' });
        } else if (err.request) {
          setErrors({ general: 'Network error. Please check your connection.' });
        } else {
          setErrors({ general: 'An unknown error occurred. Please try again.' });
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sign-in-modal-App">
      <div className="sign-in-modal-content-App">
        <span className="sign-in-close-button-App" onClick={onClose}>
          &times;
        </span>
        <h2>Sign In</h2>
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
