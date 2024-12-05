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

  // Function to update the progress step 2
  const updateProgress = async () => {
    setIsLoading(true);

    try {
      await axios.put(`/api/users/${userId}/update-progress`, { progress: 2 });
      console.log("Progress updated successfully to 2 for userId:", userId);
      setCurrentStep(2); // Update the progress step in the parent component
    } catch (error) {
      console.error("Error updating progress:", error);
    } finally {
      setIsLoading(false);
    }
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
          updateProgress={updateProgress} // Make sure this is correct
        />
      )}
    </div>
  );
};

export default ParentComponent;
