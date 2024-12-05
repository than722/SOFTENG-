import React, { useEffect, useState } from "react";
import "./ProgressBar.css";

const ProgressBar = ({ employeeId }) => {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!employeeId) {
      console.error("Employee ID is undefined.");
      return;
    }

    // Fetch employee progress from the backend
    fetch(`http://localhost:8081/api/employee/${employeeId}/progress`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employee progress");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Employee progress:", data);
        setCurrentStep(data.progressId || 1); // Update the progress step dynamically
      })
      .catch((err) => {
        console.error("Error fetching employee progress:", err);
      });
  }, [employeeId]);

  const steps = [
    { step: 1, label: "Account Created" },
    { step: 2, label: "Files Reviewing" },
    { step: 3, label: "Medical Check" },
    { step: 4, label: "NBI Check" },
    { step: 5, label: "TESDA Certification" },
    { step: 6, label: "Can Apply!" },
  ];

  return (
    <div className="progress-bar-container">
      {steps.map((step, index) => (
        <div
          key={step.step}
          className={`progress-step ${
            currentStep >= step.step ? "completed" : "grayed"
          }`}
        >
          <div
            className={`step-circle ${
              currentStep >= step.step ? "completed" : "grayed"
            }`}
          >
            {currentStep >= step.step ? "✓" : step.step}
          </div>
          <p
            className={`step-label ${
              currentStep === 6 && step.step === 6 ? "green-out" : ""
            }`}
          >
            {step.label}
          </p>
          {index < steps.length - 1 && (
            <div
              className={`progress-line ${
                currentStep > step.step ? "completed" : ""
              }`}
              style={{
                width: currentStep > step.step ? "100%" : "0%",
              }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
