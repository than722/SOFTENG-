// src/EmployerP.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './App.css';
import Profile from './profile/Profile';
import SignOut from './Sign in/SignOut';
import EmployerJobDetailView from './job posting/EmployerJobDetailView';
import HeaderEmployer from './Header/HeaderEmployer';

const EmployerP = ({ onSignOut, auth }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: userId } = useParams(); // Get userId from route parameters

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Make sure the API call includes userType to differentiate between employee and employer
        const userType = 'employer';  // This can be dynamic based on user role
        const response = await fetch(`http://localhost:8081/api/users/${userId}?userType=${userType}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Authentication token
          },
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
        setError("Failed to load profile information.");
      } finally {
        setLoading(false);
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
      <HeaderEmployer 
        userId={userId} 
        auth={auth} 
        onSignOut={onSignOut} 
        />

      {/* Main content for the employer page */}
      <main className="content-App" id='about'>
        <div className="text-section-App">
          <h1 className="company-name-App">MMML</h1>
          <h2 className="tagline-App">Recruitment Services Incorporated</h2>
          <p className="description-App">
            Maddy, Minette, Miles, Lollie "MMML" was founded in 1999 in Manila with its mission to assist Filipinos in finding jobs abroad.
            Its initial focus is domestic helpers in Kuwait and Bahrain. Its current reach is multiple countries and diverse jobs,
            having recognition from the POEA, OWWA, and DOLE. The corporation specializes in marketing and HR training with a goal of
            employer and client satisfaction, aiming for improved local employment rate and awards for exceptional services.
          </p>
        </div>
      </main>
      <div className='second-panel' id='vision'>
        <div className='VISION'>
          <h1 className='vision-title'>VISION</h1>
          <p className='vision-statement'>MMML Recruitment Services, Inc. envisions becoming the premier global recruitment agency that champions the potential of Filipino workers by connecting them to meaningful, life-changing employment opportunities abroad. We aspire to be recognized worldwide for our commitment to excellence, ethical recruitment practices, and unwavering dedication to the welfare of both our clients and workers. Through our efforts, we aim to uplift the standard of Filipino talent in the global workforce, ensuring they are valued for their skills, resilience, and professionalism. By fostering strong international partnerships and continually innovating our services, we seek to contribute to the long-term economic growth of the Philippines, empower Filipino families, and inspire future generations to dream and achieve beyond borders. Our ultimate goal is to become a symbol of trust and opportunity, creating a future where every Filipino worker is given the platform to excel and thrive in the global arena.</p>

        </div>
      </div>
      <div className='third-panel' id='mission'>
        <div className='MISSION'>
          <h1 className='mission-title'>MISSION</h1>
          <p className='mission-statement'>Our mission is to empower Filipino workers by offering world-class recruitment services that connect them to dignified and rewarding employment abroad, enhancing their skills and improving their quality of life. We are committed to upholding the highest standards of integrity, transparency, and ethical practices throughout the recruitment process. By actively contributing to the reduction of unemployment in the Philippines, we support national development and foster a globally competitive workforce. Through strong partnerships with international employers and a dedication to excellence, we aim to ensure mutual satisfaction for both employers and employees, while positively impacting the families and communities of Filipino workers.</p>

        </div>
      </div>
    </div>
  );
};

export default EmployerP;
