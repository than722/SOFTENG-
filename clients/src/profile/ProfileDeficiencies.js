import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileDeficiencies.css';

const ProfileDeficiencies = ({ employeeId, civilStatus }) => {
  const [deficiencies, setDeficiencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noDeficienciesMessage, setNoDeficienciesMessage] = useState('');

  const deficiencyTypeMapping = {
    'picture': 'picture',
    'resume': 'resume',
    'birth_certificate': 'birth_certificate',
    'passport': 'passport',
    'marriage_contract': 'marriage_contract',
  };

  useEffect(() => {
    if (!employeeId) return;

    axios
      .get(`http://localhost:8081/api/users/${employeeId}?userType=employee`)
      .then((response) => {
        const userData = response.data;
        if (userData.noDeficienciesMessage) {
          setNoDeficienciesMessage(userData.noDeficienciesMessage);
        }

        const deficienciesWithTypes = userData.deficiencies?.map((deficiency) => {
          const type = deficiencyTypeMapping[deficiency] || 'unknown';
          return { file_name: deficiency, type };
        });

        setDeficiencies(deficienciesWithTypes || []);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching deficiencies:', err);
        setError('Failed to load deficiencies.');
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

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
          prev.filter((item) => item.file_name !== deficiency.file_name)
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
      {noDeficienciesMessage ? (
        <p>{noDeficienciesMessage}</p>
      ) : (
        <ul className="deficiencies-list">
          {deficiencies.map((deficiency, index) => (
            <li key={index} className="deficiency-item">
              <p>
                <strong>{deficiency.file_name}:</strong> {deficiency.reason}
              </p>
              <div className="deficiency-action">
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
