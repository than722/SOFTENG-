import React, { useState } from "react";
import ProgressBar from "../Progress/ProgressBar";
import ViewProfile from "./ViewProfile";


const ParentComponent = () => {
  // State for the current progress step
  const [currentStep, setCurrentStep] = useState(1);

  // Example user data
  const selectedUser = { id: 123, firstName: "John", lastName: "Doe" };

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

  return (
    <div>
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep} />

      {/* View Profile */}
      <ViewProfile
        user={selectedUser}
        closeModal={closeModalHandler}
        acceptUser={acceptUserHandler}
        rejectUser={rejectUserHandler}
        handleDeficiencyRequest={handleDeficiencyRequestHandler}
        updateProgressStep={updateProgressStep} // Pass the function here
      />
    </div>
  );
};

export default ParentComponent;
