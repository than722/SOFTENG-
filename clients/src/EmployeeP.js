import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import logo from './assets/images/logo4.png';
import Profile from './profile/Profile';

const EmployeeP = ({ onSignOut, auth }) => {
  const [profileData, setProfileData] = useState(null); // State for profile data
  const [name, setName] = useState(''); // User name from authentication response
  const [message, setMessage] = useState(''); // Message for authentication status
  const { id: userId } = useParams(); // Get userId from route parameters
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:8081/')
      .then(res => {
        if (res.data.Status === "Success") {
          setName(res.data.name);
          fetchProfile(userId); // Fetch profile if authenticated
        } else {
          setMessage(res.data.Message || 'Not authenticated');
        }
      })
      .catch(err => console.error('Error fetching authentication status:', err));
  }, [userId]);

  const fetchProfile = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/users/${id}`);
      setProfileData(response.data); // Set profile data
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  return (
    <div className="employee-page-container">
      {/* Custom header for the employee page */}
      <header className="navbar-App">
        <img src={logo} alt="Logo" className="logo-App" />
        <nav>
          <ul>
            <li><a href="#about">ABOUT US</a></li>
            <li><a href="#vision">VISION</a></li>
            <li><a href="#mission">MISSION</a></li>
            <li><Link to="/view-job">View Job Posting</Link></li>
            {auth && userId && (
              <li><Link to={`/profile/${userId}`}>Profile</Link></li>
            )}
          </ul>
        </nav>
        <div className="button2">
          <button className="sign-out-App" onClick={onSignOut}>SIGN OUT</button>
        </div>
      </header>

      {/* Main content for the employee page */}
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
        </div>

        <div className="image-section-App">
          <img src="woman-smiling.png" alt="Smiling Woman" className="main-image-App" />
        </div>

        {/* Display profile information if available */}
        {profileData && (
          <Profile profileData={profileData} />
        )}
      </main>
    </div>
  );
};

export default EmployeeP;
