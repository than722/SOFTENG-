import React, { useState, useEffect, useCallback } from 'react';
import './Profile.css';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HeaderEmployer from '../Header/HeaderEmployer';
import HeaderEmployee from '../Header/HeaderEmployee';
import SignOut from '../Sign in/SignOut';
import WithdrawApplication from '../admin/WithdrawApplication';
import ProfileDeficiencies from './ProfileDeficiencies';

const Profile = () => {
  const { id, accountType } = useParams(); // Extract both id and accountType from route params
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [age, setAge] = useState(null); // To store calculated age
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
    companyName: '', // Field for company name if profile is an employer
  });

      // Calculate age based on birthday
      const calculateAge = (birthday) => {
        if (!birthday) {
          setAge(null);
          return;
        }
        const birthDate = new Date(birthday);
        const today = new Date();
        const calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
    
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
          setAge(calculatedAge - 1);
        } else {
          setAge(calculatedAge);
        }
      };

// Fetch profile data based on account type (employee or employer)
const fetchProfile = useCallback(() => {
  const url = `http://localhost:8081/api/users/${id}?userType=${accountType}`; // Add userType as a query parameter

  axios.get(url)
    .then(response => {
      const data = response.data;

      // Set profile data and updated form data
      setProfileData(data);
      setUpdatedData({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        birthday: data.birthday || '', // Handle birthday field
        province: data.province,
        municipality: data.municipality,
        barangay: data.barangay,
        zipCode: data.zipCode,
        mobileNumber: data.mobileNumber,
        picture: null,
        resume: null,
        companyName: data.companyName || '', // For employer
      });

      // Calculate age if birthday is present
      if (data.birthday) {
        calculateAge(data.birthday); // Correctly calculate age
      } else {
        setAge(null);
      }

      setError(null); // Clear any errors
    })
    .catch(error => {
      console.error('Error fetching profile data:', error);
      setError('Error fetching profile data');
    });
}, [id, accountType]);




  useEffect(() => {
    if (!id || !accountType) {
      setError('ID or account type is missing');
      return;
    }

    fetchProfile();
  }, [id, accountType, fetchProfile]);

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
      if (key === 'picture' || key === 'resume') {
        if (updatedData[key]) {
          formData.append(key, updatedData[key]);
        } else {
          formData.append(key, null);
        }
      } else {
        formData.append(key, updatedData[key]);
      }
    });
  
    const url = `http://localhost:8081/api/users/${id}`; // Unified endpoint for updates
  
    axios.put(url, formData)
      .then(() => {
        fetchProfile(); // Fetch updated profile data
        setIsEditing(false);
      })
      .catch(error => {
        console.error('Error updating profile data:', error);
        setError('Error updating profile data');
      });
  };
  
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this profile? This action cannot be undone.")) {
      const url = accountType === 'employer' 
        ? `http://localhost:8081/api/employers/${id}`
        : `http://localhost:8081/api/employees/${id}`;

      axios.delete(url)
        .then(() => {
          alert('Profile deleted successfully');
          navigate('/');
        })
        .catch(error => {
          console.error('Error deleting profile:', error);
          const errorMessage = error.response?.data?.error || 'Error deleting profile';
          setError(errorMessage);
        });
    }
  };

  
  if (error) {
    return <div>{error}</div>;
  }

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <>



      {/* Dynamically render the header */}
      {accountType === 'employer' ? (
        <HeaderEmployer 
          userId={id} 
          onSignOut={() => <SignOut />} // Call SignOut for employer
        />
      ) : (
        <HeaderEmployee 
          userId={id} 
          onSignOut={() => <SignOut />} // Call SignOut for employee
        />
      )}

    <div className="profile-container">
      <h1>{profileData.firstName} {profileData.lastName}'s Profile</h1>
      <div className="profile-info">
        {isEditing ? (
          <>
            {/* Editable fields for both employee and employer */}
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
              <label htmlFor="birthday">Birthday:</label>
              <input
                id="birthday"
                type="date"
                name="birthday"
                value={updatedData.birthday}
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
            {accountType === 'employer' && (
              <div className="form-group">
                <label htmlFor="companyName">Company Name:</label>
                <input 
                  id="companyName"
                  type="text" 
                  name="companyName" 
                  value={updatedData.companyName} 
                  onChange={handleChange} 
                />
              </div>
            )}
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
            {/* Display fields for both employee and employer */}
            <p><strong>First Name:</strong> {profileData.firstName}</p>
            <p><strong>Last Name:</strong> {profileData.lastName}</p>
            <p><strong>Middle Name:</strong> {profileData.middleName}</p>
            <p><strong>Age:</strong> {age !== null ? `${age} years old` : 'Not specified'}</p>
            <p><strong>Province:</strong> {profileData.province}</p>
            <p><strong>City/Municipality:</strong> {profileData.municipality}</p>
            <p><strong>Barangay:</strong> {profileData.barangay}</p>
            <p><strong>Zip Code:</strong> {profileData.zipCode}</p>
            <p><strong>Mobile Number:</strong> {profileData.mobileNumber}</p>
            {accountType === 'employer' && (
              <p><strong>Company Name:</strong> {profileData.companyName}</p>
            )}
            <div className="button-group">
  
              <button onClick={handleEditToggle}>Edit</button>
              <button onClick={handleDelete}>Delete Profile</button>

              {accountType === 'employee' && <WithdrawApplication employeeId={id} />}

        {/* Show ProfileDeficiencies only for employees */}
        {accountType === 'employee' && <ProfileDeficiencies employeeId={id} />}
      </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default Profile;
