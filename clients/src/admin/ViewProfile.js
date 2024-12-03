import React, { useState, useEffect } from 'react';
import './Admin.css';

const ViewProfile = ({
  user,
  closeModal,
  acceptUser,
  rejectUser,
  handleDeficiencyRequest,
  updateProgressStep,
}) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [currentFileType, setCurrentFileType] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [fileStatus, setFileStatus] = useState({
    medicalCertificate: false,
    nbiCertificate: false,
    tesdaCertificate: false,
    resume: false,
    validID: false,
    birthCertificate: false,
    passport: false,
  });

  useEffect(() => {
    // Ensure file statuses are set based on the user data (for initial load)
    setFileStatus({
      medicalCertificate: user.medicalCertificateUploaded || false,
      nbiCertificate: user.nbiCertificateUploaded || false,
      tesdaCertificate: user.tesdaCertificateUploaded || false,
      resume: user.resumeUploaded || false,
      validID: user.validIDUploaded || false,
      birthCertificate: user.birthCertificateUploaded || false,
      passport: user.passportUploaded || false,
    });
  }, [user]);

  useEffect(() => {
    // Check if all required files are uploaded and update progress step accordingly
    const allFilesUploaded = Object.values(fileStatus).every((status) => status);
    if (allFilesUploaded) {
      updateProgressStep(user.id, 2); // Update to step 2 when all files are uploaded
    }
  }, [fileStatus, user.id, updateProgressStep]);

  const handleFileUpload = (event, fileType) => {
    const file = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append(fileType, file);

      let endpoint = '';
      if (fileType === 'medicalCertificate') {
        endpoint = `http://localhost:8081/api/users/${user.id}/medical-certificate`;
      } else if (fileType === 'nbiCertificate') {
        endpoint = `http://localhost:8081/api/users/${user.id}/nbi-certificate`;
      } else if (fileType === 'tesdaCertificate') {
        endpoint = `http://localhost:8081/api/users/${user.id}/tesda-certificate`;
      }

      fetch(endpoint, {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (!response.ok) throw new Error(`Failed to upload ${fileType}`);
          return response.json();
        })
        .then(() => {
          setFileStatus((prevStatus) => ({
            ...prevStatus,
            [fileType]: true, // Mark as uploaded
          }));
          alert(`${fileType.replace(/([A-Z])/g, ' $1')} uploaded successfully!`);
        })
        .catch((err) => {
          console.error(`Error uploading ${fileType}:`, err);
          alert(`Failed to upload ${fileType.replace(/([A-Z])/g, ' $1')}. Please try again.`);
        });
    }
  };

  const handleRequestReupload = (fileType) => {
    setCurrentFileType(fileType);
    setIsRequestModalOpen(true);
  };

  const submitRequestReason = () => {
    if (requestReason.trim() === '') {
      alert('Please provide a reason for the request.');
      return;
    }

    handleDeficiencyRequest(user.id, currentFileType, requestReason);
    setRequestReason('');
    setIsRequestModalOpen(false);
  };

  const handleAcceptUser = () => {
    updateProgressStep(user.id, 6); // Accept user and move to Step 6
    closeModal();
  };

  return (
    <div className="modal-admin">
      <div className="modal-content-admin">
        <div className="profile-header">
          <h2>{user.firstName} {user.lastName}'s Profile</h2>
          {user.pictureUrl ? (
            <div className="profile-picture">
              <img
                src={`http://localhost:8081/uploads/${user.pictureUrl}`}
                alt="Profile"
              />
            </div>
          ) : (
            <p>No profile picture uploaded</p>
          )}
        </div>
        <div className="profile-info">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>First Name:</strong> {user.firstName}</p>
          <p><strong>Last Name:</strong> {user.lastName}</p>
          <p><strong>Province:</strong> {user.province}</p>
          <p><strong>Municipality:</strong> {user.municipality}</p>
          <p><strong>Barangay:</strong> {user.barangay}</p>
          <p><strong>Zip Code:</strong> {user.zipCode}</p>
          <p><strong>Mobile Number:</strong> {user.mobileNumber}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Status:</strong> {user.progressId === 1 ? 'Active' : 'Inactive'}</p>

          {/* File Uploads */}
          <p>
            <strong>Medical Certificate:</strong>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, 'medicalCertificate')}
            />
            {fileStatus.medicalCertificate && <span className="checkmark">✔</span>}
          </p>

          <p>
            <strong>NBI Clearance:</strong>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, 'nbiCertificate')}
            />
            {fileStatus.nbiCertificate && <span className="checkmark">✔</span>}
          </p>

          <p>
            <strong>TESDA Certificate:</strong>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, 'tesdaCertificate')}
            />
            {fileStatus.tesdaCertificate && <span className="checkmark">✔</span>}
          </p>

          {/* Other File Statuses */}
          <p>
            <strong>Resume:</strong>
            {user.resumeUrl ? (
              <>
                <a
                  href={`http://localhost:8081/uploads/${user.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Resume
                </a>
                <button
                  className="deficiency-button"
                  onClick={() => handleDeficiencyRequest(user.id, 'resume')}
                >
                  Request Reupload
                </button>
              </>
            ) : (
              'No file uploaded'
            )}
            <input
              type="checkbox"
              checked={fileStatus.resume}
              onChange={() => setFileStatus((prev) => ({ ...prev, resume: !prev.resume }))}
            />
            {fileStatus.resume && <span className="checkmark">✔</span>}
          </p>

          {/* More files with checkmarks */}
          <p>
            <strong>Valid ID:</strong>
            {fileStatus.validID && <span className="checkmark">✔</span>}
            <input
              type="checkbox"
              checked={fileStatus.validID}
              onChange={() => setFileStatus((prev) => ({ ...prev, validID: !prev.validID }))}
            />
          </p>

          <p>
            <strong>Birth Certificate:</strong>
            {fileStatus.birthCertificate && <span className="checkmark">✔</span>}
            <input
              type="checkbox"
              checked={fileStatus.birthCertificate}
              onChange={() => setFileStatus((prev) => ({ ...prev, birthCertificate: !prev.birthCertificate }))}
            />
          </p>

          <p>
            <strong>Passport:</strong>
            {fileStatus.passport && <span className="checkmark">✔</span>}
            <input
              type="checkbox"
              checked={fileStatus.passport}
              onChange={() => setFileStatus((prev) => ({ ...prev, passport: !prev.passport }))}
            />
          </p>

          {/* Action buttons */}
          <div className="modal-footer">
            <button onClick={handleAcceptUser} className="accept-button">Accept</button>
            <button onClick={closeModal} className="close-button">Close</button>
          </div>
        </div>
      </div>

      {/* Modal for requesting file re-upload */}
      {isRequestModalOpen && (
        <div className="modal-reupload">
          <div className="modal-content">
            <h2>Provide Reason for Re-upload</h2>
            <textarea
              placeholder="Enter reason here..."
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
            ></textarea>
            <div className="modal-footer">
              <button onClick={submitRequestReason}>Submit</button>
              <button onClick={() => setIsRequestModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProfile;
