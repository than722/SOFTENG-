import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
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
import EmployeeP from './EmployeeP';
import EmployerP from './EmployerP';
import CreateAcc from './Sign in/CreateAcc';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false); // Add state for SignIn modal

  // Handle opening and closing of the selection modal
  const openSelectionModal = () => setIsSelectionModalOpen(true);
  const closeSelectionModal = () => setIsSelectionModalOpen(false);

  // Handle opening and closing of the sign-in modal
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  // Handle form submission from CreateAcc
  const handleFormSubmit = (values, picture, resume) => {
    const formData = new FormData();
    formData.append('accountType', values.accountType);
    Object.keys(values).forEach(key => {
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
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(res => {
      console.log('Full Response Data:', res.data);
      if (res.data.id) {
        localStorage.setItem('authToken', res.data.token);
        setIsAuthenticated(true);
        window.location.href = `/profile/${values.accountType}/${res.data.id}`;
      } else {
        console.error('No ID returned from the backend.');
      }
    })
    .catch(err => {
      console.error('Error during submission:', err);
    });
  };

  return (
    <Router>
      <AppContent 
        isAuthenticated={isAuthenticated}
        openSelectionModal={openSelectionModal}
        isSelectionModalOpen={isSelectionModalOpen}
        closeSelectionModal={closeSelectionModal}
        handleFormSubmit={handleFormSubmit}
        setIsAuthenticated={setIsAuthenticated}
        isSignInModalOpen={isSignInModalOpen} // Pass state to AppContent
        openSignInModal={openSignInModal} // Pass function to open SignIn modal
        closeSignInModal={closeSignInModal} // Pass function to close SignIn modal
      />
    </Router>
  );
};

// Separate AppContent to use useLocation()
const AppContent = ({ 
  isAuthenticated, 
  openSelectionModal, 
  isSelectionModalOpen, 
  closeSelectionModal, 
  handleFormSubmit, 
  setIsAuthenticated,
  isSignInModalOpen,
  openSignInModal,
  closeSignInModal
}) => {
  const location = useLocation(); // Now useLocation() is used within Router context

  // Determine whether to show the header
  const showHeader = location.pathname !== '/employee' && location.pathname !== '/employer' && location.pathname !== '/view-job' && location.pathname !== '/add-job';

  return (
    <div className="app-container-App">
      {/* Conditionally render the header */}
      {showHeader && (
        <header className="navbar-App">
          <img src={logo} alt="Logo" className="logo-App" />
          <nav>
            <ul>
              <li><a href="#about">ABOUT US</a></li>
              <li><a href="#vision">VISION</a></li>
              <li><a href="#mission">MISSION</a></li>
            </ul>
          </nav>
          <div className='button2'>
            {!isAuthenticated ? (
              <>
                <button className="create-account-App" onClick={openSelectionModal}>CREATE ACCOUNT</button>
                <button className="sign-in-App" onClick={openSignInModal}>SIGN IN</button> {/* Updated to open SignIn modal */}
              </>
            ) : (
              <SignOut onSignOut={() => setIsAuthenticated(false)} />
            )}
          </div>
        </header>
      )}

      <Routes>
        <Route path="/" element={(
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
          </main>
        )} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile/:accountType/:id" element={<Profile />} />
        <Route path="/profile-table" element={<ProfileTable />} />
        <Route path="/add-job" element={<AddJobPosting />} />
        <Route path="/view-job" element={<ViewJobPosting />} />
        <Route path="/employee" element={<EmployeeP />} />
        <Route path="/employer" element={<EmployerP/>} />
      </Routes>

      {/* Use the CreateAcc component for account creation modals */}
      <CreateAcc 
        isSelectionOpen={isSelectionModalOpen}
        onCloseSelection={closeSelectionModal}
        onFormSubmit={handleFormSubmit}
      />

      {/* Use the SignIn component for the sign-in modal */}
      <SignIn 
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
      />
    </div>
  );
};

export default App;
