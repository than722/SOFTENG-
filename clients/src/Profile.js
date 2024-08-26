import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Fetch the employee profile data from the backend
    axios.get(`http://localhost:8081/api/employees/${id}`)
      .then(response => {
        setProfileData(response.data);
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, [id]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>{profileData.firstName} {profileData.lastName}'s Profile</h1>
      <div className="profile-info">
        <p><strong>First Name:</strong> {profileData.firstName}</p>
        <p><strong>Last Name:</strong> {profileData.lastName}</p>
        <p><strong>Middle Name:</strong> {profileData.middleName}</p>
        <p><strong>Province:</strong> {profileData.province}</p>
        <p><strong>Municipality:</strong> {profileData.municipality}</p>
        <p><strong>Barangay:</strong> {profileData.barangay}</p>
        <p><strong>Zip Code:</strong> {profileData.zipCode}</p>
        <p><strong>Mobile Number:</strong> {profileData.mobileNumber}</p>
        <p><strong>Status:</strong> {profileData.status}</p>
      </div>
      {profileData.picture && (
        <div className="profile-picture">
          <img src={`http://localhost:8081/${profileData.picture}`} alt="Profile" />
        </div>
      )}
      {profileData.resume && (
        <div className="profile-resume">
          <a href={`http://localhost:8081/${profileData.resume}`} download>Download Resume</a>
        </div>
      )}
    </div>
  );
};

export default Profile;
