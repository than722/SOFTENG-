import React, { useState, useEffect } from 'react';
import './Admin.css';

const ViewProfile = ({
  user, // Selected user data
  closeModal,
  rejectUser,
  handleDeficiencyRequest,
}) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false); // State for reupload modal
  const [currentFileType, setCurrentFileType] = useState(''); // Track the current file type
  const [requestReason, setRequestReason] = useState(''); // Reason for reupload
  const [fileApprovals, setFileApprovals] = useState({
    resume: false,
    validID: false,
    birthCertificate: false,
    passport: false,
  });

   // Check if all files are approved and update progress step
   useEffect(() => {
    const allApproved = Object.values(fileApprovals).every((isApproved) => isApproved);

    if (allApproved) {
      console.log(`All files approved for user ID: ${user.id}`);
      updateProgressForUser(user.id, 2); // Progress step 2 for file approvals
    } else {
      console.log(`Some files are not approved for user ID: ${user.id}`);
    }
  }, [fileApprovals, user.id]);

       // Function to update progress in the backend
  const updateProgressForUser = async (userId, progressStep) => {
    try {
      const response = await fetch(`http://localhost:8081/api/users/${userId}/update-progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          progressId: progressStep,
        }),
      });

      if (!response.ok) throw new Error('Failed to update user progress');

      const data = await response.json();
      alert(`Progress updated to step ${progressStep} for user ID: ${userId}`);
    } catch (err) {
      console.error('Error updating user progress:', err);
      alert('Failed to update progress. Please try again.');
    }
  };

  // Handle file approval
  const handleApprove = async (fileType) => {
    try {
      const response = await fetch('http://localhost:8081/approve-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: user.id,
          fileType,
        }),
      });

      if (!response.ok) throw new Error('Failed to approve file');

      const data = await response.json();
      console.log(data.message); // Log success message
      alert(`${fileType.replace(/([A-Z])/g, ' $1')} approved.`);

      setFileApprovals((prev) => ({
        ...prev,
        [fileType]: true,
      }));
    } catch (err) {
      console.error('Error sending approval to backend:', err);
      alert('Failed to approve file. Please try again.');
    }
  };
  

 // Handle file uploads
 const handleFileUpload = (event, type) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append(type, file);

    let endpoint = '';
    if (type === 'medicalCertificate') {
      endpoint = `http://localhost:8081/api/users/${user.id}/medical-certificate`;
    } else if (type === 'nbiCertificate') {
      endpoint = `http://localhost:8081/api/users/${user.id}/nbi-certificate`;
    } else if (type === 'tesdaCertificate') {
      endpoint = `http://localhost:8081/api/users/${user.id}/tesda-certificate`;
    }

    fetch(endpoint, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to upload ${type}`);
        return response.json();
      })
      .then(() => {
        alert(`${type.replace(/([A-Z])/g, ' $1')} uploaded successfully!`);
        // Update progress based on file type
        if (type === 'medicalCertificate') {
          updateProgressForUser(user.id, 3); // Step 3: Medical Certificate
        } else if (type === 'nbiCertificate') {
          updateProgressForUser(user.id, 4); // Step 4: NBI Certificate
        } else if (type === 'tesdaCertificate') {
          updateProgressForUser(user.id, 5); // Step 5: TESDA Certificate
        }
      })
      .catch((err) => {
        console.error(`Error uploading ${type}:`, err);
        alert(`Failed to upload ${type.replace(/([A-Z])/g, ' $1')}. Please try again.`);
      });
  }
};
 // Request reupload modal
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

  // Reset state and close the modal
  setRequestReason('');
  setIsRequestModalOpen(false);
};

const handleAcceptUser = async () => {
  try {
    const response = await fetch(`http://localhost:8081/api/users/${user.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        progressId: 6,
        statusId: 1, // Status ID set to 1 for "Accepted"
      }),
    });

    if (!response.ok) throw new Error('Failed to update user status and progress');

    const data = await response.json();
    alert('User has been accepted successfully!');
    closeModal();
  } catch (err) {
    console.error(err);
    alert('Error accepting user. Please try again.');
  }
};
  

  return (
    <div className="modal-admin">
      <div className="modal-content-admin">
        <div className="profile-header">
          <h2>
            {user.firstName} {user.lastName}'s Profile
          </h2>
          {user.pictureUrl ? (
            <div className="profile-picture">
              <img
                src={`http://localhost:8081${user.pictureUrl}`}
                alt="Profile"
              />
            </div>
          ) : (
            <p>No profile picture uploaded</p>
          )}
        </div>
        <div className="profile-info">
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>First Name:</strong> {user.firstName}
          </p>
          <p>
            <strong>Last Name:</strong> {user.lastName}
          </p>
          <p>
            <strong>Province:</strong> {user.province}
          </p>
          <p>
            <strong>Municipality:</strong> {user.municipality}
          </p>
          <p>
            <strong>Barangay:</strong> {user.barangay}
          </p>
          <p>
            <strong>Zip Code:</strong> {user.zipCode}
          </p>
          <p>
            <strong>Mobile Number:</strong> {user.mobileNumber}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            {user.status_id === 1
              ? 'Active'
              : user.status_id=== 2
              ? 'Inactive'
              : 'Pending'}
          </p>

            {/* Medical Certificate Upload */}
            <p>
            <strong>Medical Certificate:</strong>{' '}
            <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png" // Accept both files and images
                onChange={(e) => handleFileUpload(e, 'medicalCertificate')}
            />
            </p>

            {/* NBI Certificate Upload */}
            <p>
            <strong>NBI Clearance:</strong>{' '}
            <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png" // Accept both files and images
                onChange={(e) => handleFileUpload(e, 'nbiCertificate')}
            />
            </p>

            {/* TESDA Certificate Upload */}
            <p>
            <strong>TESDA Certificate:</strong>{' '}
            <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png" // Accept both files and images
                onChange={(e) => handleFileUpload(e, 'tesdaCertificate')}
            />
            </p>


          {/* Resume */}
          <p>
            <strong>Resume:</strong>{' '}
            {user.resumeUrl ? (
              <>
                <a
                  href={`http://localhost:8081${user.resumeUrl}`}
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
          <p>
            <strong>Resume:</strong>{' '}
            {fileApprovals.resume ? (
              <span>Approved</span>
            ) : (
              <button onClick={() => handleApprove('resume')}>Approve</button>
            )}
          </p>
          </p>

          {/* Valid ID */}
          <p>
            <strong>Valid ID:</strong>{' '}
            {user.validIDUrl ? (
              <>
                <a
                  href={`http://localhost:8081${user.validIDUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Valid ID
                </a>
                <button
                  className="deficiency-button"
                  onClick={() => handleDeficiencyRequest(user.id, 'valid ID')}
                >
                  Request Reupload
                </button>
              </>
            ) : (
              'No file uploaded'
            )}
          <div>
            <strong>Valid ID:</strong>{' '}
            {fileApprovals.validID ? (
              <span>Approved</span>
            ) : (
              <button onClick={() => handleApprove('validID')}>Approve</button>
            )}
          </div>
          </p>

          {/* Birth Certificate */}
          <p>
            <strong>Birth Certificate:</strong>{' '}
            {user.birthcertificateUrl ? (
              <>
                <a
                  href={`http://localhost:8081${user.birthcertificateUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Birth Certificate
                </a>
                <button
                  className="deficiency-button"
                  onClick={() =>
                    handleDeficiencyRequest(user.id, 'birth_certificate')
                  }
                >
                  Request Reupload
                </button>
              </>
            ) : (
              'No file uploaded'
            )}
          <div>
            <strong>Birth Certificate:</strong>{' '}
            {fileApprovals.birthCertificate ? (
              <span>Approved</span>
            ) : (
              <button onClick={() => handleApprove('birthCertificate')}>Approve</button>
            )}
          </div>
          </p>

          {/* Passport */}
          <p>
            <strong>Passport:</strong>{' '}
            {user.passportUrl ? (
              <>
                <a
                  href={`http://localhost:8081${user.passportUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Passport
                </a>
                <button
                  className="deficiency-button"
                  onClick={() => handleDeficiencyRequest(user.id, 'passport')}
                >
                  Request Reupload
                </button>
              </>
            ) : (
              'No file uploaded'
            )}
          <div>
            <strong>Passport:</strong>{' '}
            {fileApprovals.passport ? (
              <span>Approved</span>
            ) : (
              <button onClick={() => handleApprove('passport')}>Approve</button>
            )}
          </div>
          </p>

          {/* Marriage Contract */}
          <p>
            <strong>Marriage Contract:</strong>{' '}
            {user.marriagecontractUrl ? (
              <a
                href={`http://localhost:8081${user.marriagecontractUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Marriage Contract
              </a>
            ) : (
              'No file uploaded'
            )}
          </p>

          {/* NBI Clearance */}
          <p>
            <strong>NBI Clearance:</strong>{' '}
            {user.nbi_clearanceUrl ? (
              <a
                href={`http://localhost:8081${user.nbi_clearanceUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View NBI Clearance
              </a>
            ) : (
              'No file uploaded'
            )}
          </p>
        {/* Reupload Modal */}
          {isRequestModalOpen && (
            <div className="modal-admin">
              <div className="modal-content-admin">
                <h3>Request Reupload: {currentFileType}</h3>
                <textarea
                  placeholder="Enter reason for requesting reupload..."
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  rows="4"
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <div className="modal-buttons">
                  <button onClick={submitRequestReason}>Submit</button>
                  <button onClick={() => setIsRequestModalOpen(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
        <div className="modal-buttons">
          <button onClick={handleAcceptUser}>Accept</button>
          <button onClick={rejectUser}>Reject</button>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;