import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProgressBar from "../Progress/ProgressBar";
import ViewProfile from "./ViewProfile";

const ParentComponent = () => {
  // State for the current progress step
  const [currentStep, setCurrentStep] = useState(1);

  // State for user data and loading/error states
  const [selectedUser, setSelectedUser] = useState(null);
  const [age, setAge] = useState(null); // Age state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract userId from the URL using useParams
  const { userId } = useParams();

    // Function to calculate age from birthDate
    const calculateAge = (birthDate) => {
      if (!birthDate) return null;
      const birthDateObj = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birthDateObj.getFullYear();
      const monthDiff = today.getMonth() - birthDateObj.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
      }
      return age;
    };

 // Fetch user data
 useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/api/users/${userId}`);
      setSelectedUser(response.data);
    } catch (err) {
      setError("Failed to fetch user data.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (userId) {
    fetchUserData();
  }
}, [userId]);



  // Function to update the progress step
  const updateProgressStep = (userId) => {
    // Directly update progressId to 2
    fetch(`http://localhost:8081/api/users/${userId}/progress`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        progressId: 2,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update user progress');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Progress updated to 2:', data);
        // Optionally, update the local state to reflect the change, if needed
      })
      .catch((err) => {
        console.error('Error updating progress:', err);
      });
  };
  
  

  // Modal handlers
  const closeModalHandler = () => console.log("Modal closed");
  const acceptUserHandler = () => console.log("User accepted");
  const rejectUserHandler = () => console.log("User rejected");

  // Handle deficiency request
  const handleDeficiencyRequestHandler = (userId, fileType, reason) =>
    console.log(`Deficiency Request for User ID ${userId}, File: ${fileType}, Reason: ${reason}`);

  if (isLoading) return <p>Loading user data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} />

      {/* View Profile */}
      {selectedUser && (
        <ViewProfile
          user={selectedUser}
          age={age} // Pass the calculated age as a prop
          closeModal={closeModalHandler}
          acceptUser={acceptUserHandler}
          rejectUser={rejectUserHandler}
          handleDeficiencyRequest={handleDeficiencyRequestHandler}
          updateProgressStep={updateProgressStep} // Make sure this is correct
        />
      )}
    </div>
  );
};

export default ParentComponent;
