// src/EmployerP.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './App.css';
import logo from './assets/images/logo4.png';
import Profile from './profile/Profile';
import SignOut from './Sign in/SignOut'; // Import SignOut component

const EmployerP = ({ onSignOut, auth }) => {
  const [profileData, setProfileData] = useState(null);
  const { id: userId } = useParams(); // Get userId from route parameters

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
    
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Expected JSON, but received a non-JSON response");
        }
    
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  console.log("Auth:", auth, "User ID:", userId);

  return (
    <div className="employer-page-container">
      {/* Custom header for the employer page */}
      <header className="navbar-App">
        <img src={logo} alt="Logo" className="logo-App" />
        <nav>
          <ul>
            <li><a href="#about">ABOUT US</a></li>
            <li><a href="#vision">VISION</a></li>
            <li><a href="#mission">MISSION</a></li>
            <li><Link to="/add-job">Add Job Posting</Link></li>
            <li><Link to="/view-job">View Job Posting</Link></li>
            {auth && userId && ( // Show profile link only if authenticated and userId is defined
              <li><Link to={`/profile/${userId}/employer`}>Profile</Link></li>
            )}
          </ul>
        </nav>
        <div className="button2">
          {/* Use the SignOut component */}
          <SignOut onSignOut={onSignOut} />
        </div>
      </header>

      {/* Main content for the employer page */}
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

export default EmployerP;
