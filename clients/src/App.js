import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './App.css';
import logo from './assets/images/logo4.png';
import axios from 'axios';
import Admin from './admin/Admin'; 
import Profile from './profile/Profile';
import ProfileTable from './profile/Profile-table';
import SignIn from './Sign in/SignIn';
import AddJobPosting from './job posting/AddJobPosting';
import ViewJobPosting from './job posting/ViewJobPosting';
import SignOut from './Sign in/SignOut';

const App = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    reEnterPassword: '',
    lastName: '',
    firstName: '',
    middleName: '',
    province: '',
    municipality: '',
    barangay: '',
    zipCode: '',
    mobileNumber: '',
    companyName: '',
    picture: '',
    resume: ''
  });

  const [picture, setPicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true); // New state for password match
  const [validFields, setValidFields] = useState({}); // Track valid fields

  // Handle input change
  const handleChange = (event) => {
    const { name, value } = event.target;

    // If user is typing in the re-enter password field, check if it matches
    if (name === 'reEnterPassword') {
      setPasswordMatch(value === values.password); // Set passwordMatch state based on comparison
    }

    setValues({
      ...values,
      [name]: value
    });

    // Mark the field as valid if input is provided
    setValidFields({
      ...validFields,
      [name]: value.trim() !== '' // Check if the field is non-empty
    });
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'picture') {
      setPicture(files[0]);
    } else if (name === 'resume') {
      setResume(files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if passwords match
    if (!passwordMatch) {
      setError('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('accountType', accountType);
    Object.keys(values).forEach((key) => {
      if (key !== 'reEnterPassword') { // Skip reEnterPassword from being submitted
        formData.append(key, values[key]);
      }
    });

    if (picture) {
      formData.append('picture', picture);
    }

    if (resume) {
      formData.append('resume', resume);
    }

    axios.post('http://localhost:8081/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
          .then(res => {
            console.log("Full Response Data:", res.data); // Log the complete response
            if (res.data.id) {
              // Store token and navigate to the profile page
              localStorage.setItem('authToken', res.data.token);
              setIsAuthenticated(true);
              window.location.href = `/profile/${accountType}/${res.data.id}`;
            } else {
              console.error('No ID returned from the backend.');
            }
          })
          .catch(err => {
            console.error('Error during submission:', err);
          });
        };

        const openSelectionModal = () => setIsSelectionModalOpen(true);
        const closeSelectionModal = () => setIsSelectionModalOpen(false);
        const openFormModal = (type) => {
          setAccountType(type);
          setIsFormModalOpen(true);
          closeSelectionModal();
        };
        const closeFormModal = () => {
          setIsFormModalOpen(false);
          setAccountType('');
          setError(''); // Clear error message on modal close
        };

        const openSignInModal = () => setIsSignInModalOpen(true); // Open SignIn modal
        const closeSignInModal = () => setIsSignInModalOpen(false);


        const handleSignInSuccess = (token) => {
          setIsAuthenticated(true);
          localStorage.setItem('authToken', token);
          closeSignInModal();
        };
        
        // Pass to SignIn component
        <SignIn isOpen={isSignInModalOpen} onClose={closeSignInModal} onSignInSuccess={handleSignInSuccess} />
        

        const inputStyle = (fieldName) => ({
          borderColor: validFields[fieldName] ? 'green' : 'initial' // Turn green if valid
        });

  return (
    <Router>
      <div className="app-container-App">
        <header className="navbar-App">
          <img src={logo} alt="Logo" className="logo-App" />
          <nav>
            <ul>
              <li><a href="#about">ABOUT US</a></li>
              <li><a href="#vision">VISION</a></li>
              <li><a href="#mission">MISSION</a></li>
              <li><Link to="/profile-table">Profile</Link></li> {/* Add Profile button */}
              <li><Link to="/add-job">Add Job Posting</Link></li> {/* Add Job Posting button */}
              <li><Link to="/view-job">View Job Posting</Link></li> {/* View Job Posting button */}
            </ul>
          </nav>
          <div className='button2'>
              {!isAuthenticated ? (
              <>
                <button className="create-account-App" onClick={openSelectionModal}>CREATE ACCOUNT</button>
                <button className="sign-in-App" onClick={openSignInModal}>SIGN IN</button>
              </>
            ) : (
              <SignOut onSignOut={() => setIsAuthenticated(false)} /> // Use the SignOut component directly
            )}
          </div>

        </header>

        <Routes>
          <Route path="/" element={
            <main className="content-App">
              <div className="text-section-App">
                <h1 className="company-name-App">MMML</h1>
                <h2 className="tagline-App">Recruitment Services Corporated</h2>
                <p className="description-App">
                  Maddy, Minette, Miles, Lollie "MMML" was founded in 1999 in Manila with its mission to assist Filipinos in finding jobs abroad.
                  Its initial focus is domestic helpers in Kuwait and Bahrain. Its current reach is multiple countries and diverse jobs,
                  having recognition from the POEA, OWWA, and DOLE. The corporation specializes in marketing and HR training with a goal of
                  employer and client satisfaction, aiming for improved local employment rate and awards for exceptional services.
                </p>
                <button className="sign-up-App" onClick={openSelectionModal}>SIGN UP</button>
              </div>

              <div className="image-section-App">
                <img src="woman-smiling.png" alt="Smiling Woman" className="main-image-App" />
              </div>

              {/* Selection Modal */}
              {isSelectionModalOpen && (
                <div className="modal-App">
                  <div className="modal-content-App">
                    <span className="close-button-App" onClick={closeSelectionModal}>&times;</span>
                    <h2>Select Account Type</h2>
                    <button className="account-type-button-App" onClick={() => openFormModal('employee')}>Employee</button>
                    <button className="account-type-button-App" onClick={() => openFormModal('employer')}>Employer</button>
                  </div>
                </div>
              )}

              {/* Sign In Modal */}
              <SignIn isOpen={isSignInModalOpen} onClose={closeSignInModal} /> {/* Use SignIn component */}

              {/* Form Modal */}
              {isFormModalOpen && (
                <div className="modal-App">
                  <div className="modal-content-App">
                    <span className="close-button-App" onClick={closeFormModal}>&times;</span>
                    <h2>{accountType === 'employee' ? 'Employee Form' : 'Employer Form'}</h2>
                    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Error message */}
                    <form onSubmit={handleSubmit}>
                      <div className="form-group-App">
                        <label>Email:</label>
                        <input 
                          type="email" 
                          name="email" 
                          placeholder="Email" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('email')} // Apply conditional style
                        />
                      </div>
                      <div className="form-group-App">
                        <label>Password:</label>
                        <input 
                          type="password" 
                          name="password" 
                          placeholder="Password" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('password')} // Apply conditional style
                        />
                      </div>
                      <div className="form-group-App">
                        <label>Re-enter Password:</label>
                        <input 
                          type="password" 
                          name="reEnterPassword" 
                          placeholder="Re-enter Password" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('reEnterPassword')} // Apply conditional style
                        />
                        {values.reEnterPassword && (
                          <p style={{ color: passwordMatch ? 'green' : 'red' }}>
                            {passwordMatch ? 'Passwords match!' : 'Passwords do not match'}
                          </p>
                        )}
                      </div>
                      <div className="form-group-App">
                        <label>Last Name:</label>
                        <input 
                          type="text" 
                          name="lastName" 
                          placeholder="Last Name" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('lastName')} // Apply conditional style
                        />
                      </div>
                      <div className="form-group-App">
                        <label>First Name:</label>
                        <input 
                          type="text" 
                          name="firstName" 
                          placeholder="First Name" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('firstName')} // Apply conditional style
                        />
                      </div>
                      <div className="form-group-App">
                        <label>Middle Name:</label>
                        <input 
                          type="text" 
                          name="middleName" 
                          placeholder="Middle Name" 
                          onChange={handleChange} 
                          style={inputStyle('middleName')} // Apply conditional style
                        />
                      </div>
                      <div className="form-group-App">
                        <label>Address:</label>
                        <input 
                          type="text" 
                          name="province" 
                          placeholder="Province" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('province')} // Apply conditional style
                        />
                        <input 
                          type="text" 
                          name="municipality" 
                          placeholder="Municipality" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('municipality')} // Apply conditional style
                        />
                        <input 
                          type="text" 
                          name="barangay" 
                          placeholder="Barangay" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('barangay')} // Apply conditional style
                        />
                        <input 
                          type="text" 
                          name="zipCode" 
                          placeholder="Zip Code" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('zipCode')} // Apply conditional style
                        />
                      </div>
                      <div className="form-group-App">
                        <label>Mobile Number:</label>
                        <input 
                          type="text" 
                          name="mobileNumber" 
                          placeholder="Mobile Number" 
                          required 
                          onChange={handleChange} 
                          style={inputStyle('mobileNumber')} // Apply conditional style
                        />
                      </div>
                      {accountType === 'employer' && (
                        <div className="form-group-App">
                          <label>Company Name (optional):</label>
                          <input 
                            type="text" 
                            name="companyName" 
                            placeholder="Company Name" 
                            onChange={handleChange} 
                            style={inputStyle('companyName')} // Apply conditional style
                          />
                        </div>
                      )}
                      {accountType === 'employee' && (
                        <>
                          <div className="form-group-App">
                            <label>Upload Picture:</label>
                            <input type="file" name="picture" accept="image/*" onChange={handleFileChange} />
                            {picture && <p className="file-name-App">Selected Picture: {picture.name}</p>}
                          </div>
                          <div className="form-group-App">
                            <label>Upload Resume:</label>
                            <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                            {resume && <p className="file-name-App">Selected Resume: {resume.name}</p>}
                          </div>
                        </>
                      )}
                      <button type="submit" className="App">Submit</button>
                    </form>
                  </div>
                </div>
              )}
            </main>
          } />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile/:accountType/:id" element={<Profile />} /> {/* Updated Route */}
          <Route path="/profile-table" element={<ProfileTable />} /> {/* Route for ProfileTable */}
          <Route path="/add-job" element={<AddJobPosting />} /> {/* Route for AddJobPosting */}
          <Route path="/view-job" element={<ViewJobPosting />} /> {/* ViewJobPosting route */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
