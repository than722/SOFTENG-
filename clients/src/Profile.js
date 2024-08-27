import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams(); // Get the employee ID from the URL
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [updatedData, setUpdatedData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    province: '',
    municipality: '',
    barangay: '',
    zipCode: '',
    mobileNumber: '',
    picture: null,
    resume: null,
  });

  useEffect(() => {
    if (!id) {
      setError('No ID provided');
      return;
    }

    // Fetch the employee profile data from the backend
    axios.get(`http://localhost:8081/api/employees/${id}`)
      .then(response => {
        setProfileData(response.data);
        setUpdatedData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          middleName: response.data.middleName,
          province: response.data.province,
          municipality: response.data.municipality,
          barangay: response.data.barangay,
          zipCode: response.data.zipCode,
          mobileNumber: response.data.mobileNumber,
        });
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
        setError('Error fetching profile data');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setUpdatedData(prevState => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    const formData = new FormData();
    Object.keys(updatedData).forEach(key => {
      formData.append(key, updatedData[key]);
    });

    axios.put(`http://localhost:8081/api/employees/${id}`, formData)
      .then(response => {
        setProfileData(response.data);
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating profile data:', error);
        setError('Error updating profile data');
      });
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>{profileData.firstName} {profileData.lastName}'s Profile</h1>
      <div className="profile-info">
        {isEditing ? (
          <>
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input 
                id="firstName"
                type="text" 
                name="firstName" 
                value={updatedData.firstName} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input 
                id="lastName"
                type="text" 
                name="lastName" 
                value={updatedData.lastName} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="middleName">Middle Name:</label>
              <input 
                id="middleName"
                type="text" 
                name="middleName" 
                value={updatedData.middleName} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="province">Province:</label>
              <input 
                id="province"
                type="text" 
                name="province" 
                value={updatedData.province} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="municipality">Municipality:</label>
              <input 
                id="municipality"
                type="text" 
                name="municipality" 
                value={updatedData.municipality} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="barangay">Barangay:</label>
              <input 
                id="barangay"
                type="text" 
                name="barangay" 
                value={updatedData.barangay} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="zipCode">Zip Code:</label>
              <input 
                id="zipCode"
                type="text" 
                name="zipCode" 
                value={updatedData.zipCode} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number:</label>
              <input 
                id="mobileNumber"
                type="text" 
                name="mobileNumber" 
                value={updatedData.mobileNumber} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="picture">Upload Picture:</label>
              <input 
                id="picture"
                type="file" 
                name="picture" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              {updatedData.picture && <p>Selected Picture: {updatedData.picture.name}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="resume">Upload Resume:</label>
              <input 
                id="resume"
                type="file" 
                name="resume" 
                accept=".pdf,.doc,.docx" 
                onChange={handleFileChange} 
              />
              {updatedData.resume && <p>Selected Resume: {updatedData.resume.name}</p>}
            </div>
            <div className="button-group">
              <button onClick={handleSave}>Save</button>
              <button onClick={handleEditToggle}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>First Name:</strong> {profileData.firstName}</p>
            <p><strong>Last Name:</strong> {profileData.lastName}</p>
            <p><strong>Middle Name:</strong> {profileData.middleName}</p>
            <p><strong>Province:</strong> {profileData.province}</p>
            <p><strong>Municipality:</strong> {profileData.municipality}</p>
            <p><strong>Barangay:</strong> {profileData.barangay}</p>
            <p><strong>Zip Code:</strong> {profileData.zipCode}</p>
            <p><strong>Mobile Number:</strong> {profileData.mobileNumber}</p>
            <p><strong>Status:</strong> {profileData.status}</p>
            {profileData.picture && (
              <div className="profile-picture">
                <img src={profileData.picture} alt="Profile" />
              </div>
            )}
            {profileData.resume && (
              <div className="profile-resume">
                <a href={profileData.resume} download>Download Resume</a>
              </div>
            )}
            <button onClick={handleEditToggle}>Edit</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
