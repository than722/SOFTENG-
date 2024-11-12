import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Admin from './admin/Admin';
import Profile from './profile/Profile';
import ProfileTable from './profile/Profile-table';
import SignIn from './Sign in/SignIn';
import AddJobPosting from './job posting/AddJobPosting';
import ViewJobPosting from './job posting/ViewJobPosting';
import EmployeeP from './EmployeeP';
import EmployerP from './EmployerP';
import CreateAcc from './Sign in/CreateAcc';
import Home from './Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  // Verify session on component load
  useEffect(() => {
    axios
      .get('http://localhost:8081/verify-session', { withCredentials: true })
      .then((response) => {
        if (response.data.message === 'Authenticated') {
          setIsAuthenticated(true);
          setAccountType(response.data.userType);
          setUserId(response.data.userId);
        }
      })
      .catch((error) => {
        console.error('Session verification failed:', error);
        setIsAuthenticated(false);
      });
  }, []);

  const openSelectionModal = () => setIsSelectionModalOpen(true);
  const closeSelectionModal = () => setIsSelectionModalOpen(false);
  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  const handleSignOut = async () => {
    try {
      await axios.post('http://localhost:8081/signout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setAccountType(null);
      setUserId(null);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleFormSubmit = (values, picture, resume) => {
    const formData = new FormData();
    formData.append('accountType', values.accountType);
    Object.keys(values).forEach(key => formData.append(key, values[key]));

    if (picture) formData.append('picture', picture);
    if (resume) formData.append('resume', resume);

    axios.post('http://localhost:8081/signup', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then(res => {
      if (res.data.id) {
        setIsAuthenticated(true);
        setAccountType(values.accountType.toLowerCase());
        setUserId(res.data.id);
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
        <Route path="/" element={
          isAuthenticated && accountType && userId ? (
            accountType === 'employee' ? (
              <Navigate to={`/employee/${userId}`} replace />
            ) : (
              <Navigate to={`/employer/${userId}`} replace />
            )
          ) : (
            <Home openSelectionModal={openSelectionModal} openSignInModal={openSignInModal} />
          )
        } />

        <Route path="/admin" element={<Admin />} />
        
        {/* Pass accountType as a prop to Profile */}
        <Route 
          path="/profile/:id/:accountType" 
          element={<Profile accountType={accountType} />} 
        />
        
        <Route path="/profile-table" element={<ProfileTable />} />
        <Route path="/add-job" element={<AddJobPosting />} />
        <Route path="/view-job" element={<ViewJobPosting />} />

        <Route path="/employee/:id" element={<EmployeeP onSignOut={handleSignOut} auth={isAuthenticated} />} />
        <Route path="/employer/:id" element={<EmployerP onSignOut={handleSignOut} auth={isAuthenticated} />} />
      </Routes>

      <CreateAcc 
        isSelectionOpen={isSelectionModalOpen}
        onCloseSelection={closeSelectionModal}
        onFormSubmit={handleFormSubmit}
      />

      <SignIn 
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        setAuth={setIsAuthenticated} // Pass setAuth to SignIn
      />
    </div>
  );
};

export default App;
