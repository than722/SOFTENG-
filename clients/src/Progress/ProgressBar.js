import React from "react";
import "./ProgressBar.css";

const ProgressBar = ({ currentStep = 1 }) => {
  const steps = [
    { step: 1, label: "Account Created" },
    { step: 2, label: "Files Reviewing" },
    { step: 3, label: "Medical Check" },
    { step: 4, label: "NBI Check" },
    { step: 5, label: "TESDA Certification" },
    { step: 6, label: "Fit to Work!"},
  ];

  return (
    <div className="progress-bar-container">
      {steps.map((step, index) => (
        <div
          key={step.step}
          className={`progress-step ${currentStep >= step.step ? "completed" : ""}`}
        >
          <div className={`step-circle ${currentStep >= step.step ? "completed" : ""}`}>
            {currentStep >= step.step ? "✓" : step.step}
          </div>
          <p className="step-label">{step.label}</p>
          {index < steps.length - 1 && (
            <div
              className="progress-line"
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
