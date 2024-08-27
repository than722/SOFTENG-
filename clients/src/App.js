import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import logo from './assets/images/logo4.png';
import axios from 'axios';
import Admin from './admin/Admin'; 
import Profile from './Profile';
import ProfileTable from './Profile-table';

const App = () => {
  const [values, setValues] = useState({
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
  const [accountType, setAccountType] = useState('');

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
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

    const formData = new FormData();
    formData.append('accountType', accountType);
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
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
        window.location.href = `/profile/${res.data.id}`;
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
  };

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
              <li><Link to="/admin">Admin</Link></li>
              <li><Link to="/profile-table">Profile</Link></li> {/* Add Profile button */}
            </ul>
          </nav>
          <button className="create-account-App" onClick={openSelectionModal}>CREATE ACCOUNT</button>
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

              {/* Form Modal */}
              {isFormModalOpen && (
                <div className="modal-App">
                  <div className="modal-content-App">
                    <span className="close-button-App" onClick={closeFormModal}>&times;</span>
                    <h2>{accountType === 'employee' ? 'Employee Form' : 'Employer Form'}</h2>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group-App">
                        <label>Last Name:</label>
                        <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
                      </div>
                      <div className="form-group-App">
                        <label>First Name:</label>
                        <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
                      </div>
                      <div className="form-group-App">
                        <label>Middle Name:</label>
                        <input type="text" name="middleName" placeholder="Middle Name" onChange={handleChange} />
                      </div>
                      <div className="form-group-App">
                        <label>Address:</label>
                        <input type="text" name="province" placeholder="Province" required onChange={handleChange} />
                        <input type="text" name="municipality" placeholder="Municipality" required onChange={handleChange} />
                        <input type="text" name="barangay" placeholder="Barangay" required onChange={handleChange} />
                        <input type="text" name="zipCode" placeholder="Zip Code" required onChange={handleChange} />
                      </div>
                      <div className="form-group-App">
                        <label>Mobile Number:</label>
                        <input type="text" name="mobileNumber" placeholder="Mobile Number" required onChange={handleChange} />
                      </div>
                      {accountType === 'employer' && (
                        <div className="form-group-App">
                          <label>Company Name (optional):</label>
                          <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} />
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
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile-table" element={<ProfileTable />} /> {/* Route for ProfileTable */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;