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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract userId from the URL using useParams
  const { userId } = useParams();

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
    console.log("Updating progress for user ID:", userId);  // Debugging line
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
      console.log('Progress updated:', data);
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
