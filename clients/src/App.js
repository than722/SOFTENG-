import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
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
import Home from './Home'; // Import Home component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState(null); // Track account type
  const [userId, setUserId] = useState(null); // Track user ID
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Handle opening and closing of the selection modal
  const openSelectionModal = () => setIsSelectionModalOpen(true);
  const closeSelectionModal = () => setIsSelectionModalOpen(false);

  // Handle opening and closing of the sign-in modal
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  // Handle SignOut With Authentication
  const handleSignOut = async () => {
    try {
      // Send sign-out request to the API
      await axios.post('http://localhost:8081/signout', {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      // Clear the authentication token and reset the state
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setAccountType(null);
      setUserId(null);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

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
        setAccountType(values.accountType.toLowerCase()); // Ensure lowercase account type
        setUserId(res.data.id); // Set user ID
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
        accountType={accountType}
        userId={userId}
        openSelectionModal={openSelectionModal}
        isSelectionModalOpen={isSelectionModalOpen}
        closeSelectionModal={closeSelectionModal}
        handleFormSubmit={handleFormSubmit}
        handleSignOut={handleSignOut} 
        setIsAuthenticated={setIsAuthenticated}
        isSignInModalOpen={isSignInModalOpen} 
        openSignInModal={openSignInModal} 
        closeSignInModal={closeSignInModal} 
      />
    </Router>
  );
};

// Separate AppContent to use useLocation()
const AppContent = ({ 
  isAuthenticated, 
  accountType,
  userId,
  openSelectionModal, 
  isSelectionModalOpen, 
  closeSelectionModal, 
  handleFormSubmit,
  handleSignOut, 
  setIsAuthenticated,
  isSignInModalOpen,
  openSignInModal,
  closeSignInModal
}) => {
  const location = useLocation();

  return (
    <div className="app-container-App">
      <Routes>
        {/* Redirect from the main page if already authenticated */}
        <Route path="/" element={
          isAuthenticated && accountType && userId ? (
            accountType === 'employee' ? (
              <Navigate to={`/employee/${userId}`} replace />
            ) : (
              <Navigate to={`/employer/${userId}`} replace />
            )
          ) : (
            <Home openSelectionModal={openSelectionModal} openSignInModal={openSignInModal} /> // Render Home component with header
          )
        } />

        <Route path="/admin" element={<Admin />} />
        <Route path="/profile/:id/:accountType" element={<Profile />} />
        <Route path="/profile-table" element={<ProfileTable />} />
        <Route path="/add-job" element={<AddJobPosting />} />
        <Route path="/view-job" element={<ViewJobPosting />} />
        
        {/* Updated routes to include dynamic parameters for employee and employer */}
        <Route path="/employee/:id" element={<EmployeeP onSignOut={handleSignOut} auth={isAuthenticated} />} />
        <Route path="/employer/:id" element={<EmployerP onSignOut={handleSignOut} auth={isAuthenticated} />} />
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
