import React, { useState } from 'react';
import axios from 'axios';
import './WithdrawApplication.css';

const WithdrawApplication = ({ employeeId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setWithdrawReason('');
    setError('');
  };

  const handleSubmit = async () => {
    if (!withdrawReason.trim()) {
      setError('Please provide a reason for withdrawal.');
      return;
    }

    try {
      // Submit withdrawal request to admin
      await axios.post('http://localhost:8081/api/admin/withdrawal-requests', {
        employeeId,
        reason: withdrawReason,
      });

      setSuccess('Withdrawal request submitted successfully.');
      setIsModalOpen(false);
      setWithdrawReason('');
    } catch (err) {
      console.error('Error submitting withdrawal request:', err);
      setError('Failed to submit withdrawal request. Please try again.');
    }
  };

  return (
    <div className="withdraw-application">
      <button onClick={handleOpenModal} className="withdraw-button">
        Withdraw Application
      </button>

      {/* Modal for Withdrawal Reason */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Reason for Withdrawal</h2>
            <textarea
              placeholder="Type your reason here..."
              value={withdrawReason}
              onChange={(e) => setWithdrawReason(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div className="modal-actions">
              <button onClick={handleSubmit} className="submit-button">
                Submit
              </button>
              <button onClick={handleCloseModal} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawApplication;
