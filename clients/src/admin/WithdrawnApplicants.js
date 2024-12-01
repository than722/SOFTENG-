import React, { useState } from 'react';
import './WithdrawnApplicants.css';
import axios from 'axios';

const WithdrawnApplicants = ({ userId, accountType, onWithdrawComplete }) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenModal = () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      alert('You are not authorized to perform this action. Please log in.');
      return;
    }
    setIsWithdrawModalOpen(true); // Open the modal
  };

  const handleWithdrawConfirm = () => {
    if (!withdrawReason) {
      alert('Please provide a reason for withdrawing the application.');
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const url = `http://localhost:8081/api/users/${userId}/withdraw`;

    axios
      .post(
        url,
        { reason: withdrawReason, accountType },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // Include auth token
          },
        }
      )
      .then(() => {
        alert('Withdrawal request submitted successfully.');
        setIsWithdrawModalOpen(false); // Close the modal
        setWithdrawReason(''); // Reset the reason
        if (onWithdrawComplete) onWithdrawComplete(); // Notify parent component
      })
      .catch((error) => {
        console.error('Error submitting withdrawal request:', error);
        setError('Error submitting withdrawal request. Please try again.');
      });
  };

  const handleWithdrawCancel = () => {
    setIsWithdrawModalOpen(false); // Close the modal
    setWithdrawReason(''); // Reset the reason
  };

  return (
    <div>
      <button onClick={handleOpenModal} className="withdraw-button">
        Withdraw Application
      </button>

      {isWithdrawModalOpen && (
        <div className="withdrawal-modal">
          <div className="withdrawal-modal-content">
            <h2>Withdraw Application</h2>
            <label htmlFor="withdrawReason">Reason for Withdrawal:</label>
            <textarea
              id="withdrawReason"
              name="withdrawReason"
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
              rows="5"
              cols="50"
              placeholder="Enter your reason here..."
            />
            {error && <p className="withdraw-error">{error}</p>}
            {success && <p className="withdraw-success">{success}</p>}
            <div className="withdrawal-modal-buttons">
              <button
                onClick={handleWithdrawConfirm}
                className="withdrawal-modal-confirm-button"
              >
                Confirm
              </button>
              <button
                onClick={handleWithdrawCancel}
                className="withdrawal-modal-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawnApplicants;
