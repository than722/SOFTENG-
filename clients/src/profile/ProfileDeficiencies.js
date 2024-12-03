import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileDeficiencies.css';

const ProfileDeficiencies = ({ employeeId, civilStatus }) => {
  const [deficiencies, setDeficiencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const deficiencyTypeMapping = {
    'picture': 'picture',
    'resume': 'resume',
    'birth_certificate': 'birth_certificate',
    'passport': 'passport',
    'marriage_contract': 'marriage_contract',
  };
  
  // In your useEffect or when rendering deficiencies:
  useEffect(() => {
    console.log('Employee ID:', employeeId); // Ensure employeeId is correct
    if (!employeeId) return;
  
    axios
      .get(`http://localhost:8081/api/employees/${employeeId}/deficiencies`)
      .then((response) => {
        const deficienciesWithTypes = response.data.map((deficiency) => {
          const type = deficiencyTypeMapping[deficiency.file_name] || 'unknown';
          return { ...deficiency, type };
        });
        setDeficiencies(deficienciesWithTypes);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching deficiencies:', err);
        setError('Failed to load deficiencies.');
      })
      .finally(() => setLoading(false));
  }, [employeeId]);
  ;

  const handleFileSubmit = (deficiency) => {
    const fileInput = document.getElementById(`file-upload-${deficiency.type}`);
    if (!fileInput || fileInput.files.length === 0) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('type', deficiency.type);

    axios
      .post(`http://localhost:8081/api/employees/${employeeId}/submit-file`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        alert('File submitted successfully!');
        setDeficiencies((prev) =>
          prev.filter((item) => item.id !== deficiency.id)
        ); // Remove resolved deficiency
      })
      .catch((err) => {
        console.error('Error submitting file:', err);
        alert('Failed to submit file. Please try again.');
      });
  };
  

  const renderUploadField = (type, label, accept) => (
    <div key={type} className="upload-field">
      <label htmlFor={`file-upload-${type}`}>{label}:</label>
      <input
        type="file"
        id={`file-upload-${type}`}
        className="file-upload-input"
        accept={accept}
      />
      <button
        onClick={() => handleFileSubmit({ type })}
        className="submit-button"
      >
        Submit
      </button>
    </div>
  );

  if (loading) return <p>Loading deficiencies...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="profile-deficiencies-container">
      <h2>Profile Deficiencies</h2>
      {deficiencies.length === 0 ? (
        <p>All files are submitted. No deficiencies.</p>
      ) : (
        <ul className="deficiencies-list">
          {deficiencies.map((deficiency) => (
            <li key={deficiency.id} className="deficiency-item">
              <p>
                <strong>{deficiency.file_name}:</strong> {deficiency.reason}
              </p>
              <div className="deficiency-action">
                {console.log('Deficiency type:', deficiency.type)} {/* Add this log */}
                {deficiency.type === 'picture' &&
                  renderUploadField("picture", "Upload Picture", "image/*")}
                {deficiency.type === 'resume' &&
                  renderUploadField("resume", "Upload Resume", ".pdf,.doc,.docx")}
                {deficiency.type === 'birth_certificate' &&
                  renderUploadField("birth_certificate", "Upload Birth Certificate", "image/*")}
                {deficiency.type === 'passport' &&
                  renderUploadField("passport", "Upload Passport (Optional)", "image/*")}
                {civilStatus === "married" && deficiency.type === "marriage_contract" &&
                  renderUploadField("marriage_contract", "Upload Marriage Contract", "image/*")}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileDeficiencies;
