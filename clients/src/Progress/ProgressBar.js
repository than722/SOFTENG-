import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ currentStep, onApprove }) => {
  const steps = [
    { step: 1, label: "Account Created" },
    { step: 2, label: "Admin Approval" },
    { step: 3, label: "Medical Check" },
    { step: 4, label: "TESDA Certification" },
  ];

  const handleApprove = (step) => {
    if (step <= currentStep) {
      console.log(`Step ${step} is already completed.`);
      return;
    }
    onApprove(step);
  };

  return (
    <div className="progress-bar-container">
      {steps.map((step) => (
        <div
          key={step.step}
          className={`progress-step ${currentStep >= step.step ? "completed" : ""}`}
        >
          <div
            className={`step-circle ${currentStep >= step.step ? "clickable" : ""}`}
            onClick={() => handleApprove(step.step)}
          >
            {currentStep >= step.step ? "✓" : step.step}
          </div>
          <p className="step-label">{step.label}</p>
        </div>
      ))}
      <div
        className="progress-line"
        style={{
          width: `${(currentStep - 1) / (steps.length - 1) * 100}%`,
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
