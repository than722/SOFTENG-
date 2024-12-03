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
  const updateProgressStep = (userId, step) => {
    console.log(`Updating progress for User ID ${userId} to Step ${step}`);
    setCurrentStep(step); // Update the current step state
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
          updateProgressStep={updateProgressStep} // Pass the function here
        />
      )}
    </div>
  );
};

export default ParentComponent;
