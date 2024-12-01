import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfileDeficiencies.css';

const ProfileDeficiencies = ({ employeeId }) => {
  const [deficiencies, setDeficiencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!employeeId) return;

    // Fetch deficiencies for the specific employee
    axios
      .get(`http://localhost:8081/api/employees/${employeeId}/deficiencies`)
      .then((response) => {
        setDeficiencies(response.data); // Assuming the response contains a list of deficiencies
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load deficiencies');
      })
      .finally(() => setLoading(false));
  }, [employeeId]);

  const handleFileSubmit = (deficiency) => {
    const fileInput = document.getElementById(`file-upload-${deficiency.type}`);
    if (fileInput.files.length === 0) {
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
          prev.filter((item) => item.type !== deficiency.type)
        ); // Remove resolved deficiency
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to submit file. Please try again.');
      });
  };

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
            <li key={deficiency.type} className="deficiency-item">
              <p>
                <strong>{deficiency.label}:</strong> {deficiency.description}
              </p>
              <div className="deficiency-action">
                <input
                  type="file"
                  id={`file-upload-${deficiency.type}`}
                  className="file-upload-input"
                />
                <button
                  onClick={() => handleFileSubmit(deficiency)}
                  className="submit-button"
                >
                  Submit
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileDeficiencies;
