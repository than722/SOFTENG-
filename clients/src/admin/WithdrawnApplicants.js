import React, { useState, useEffect } from 'react';
import './AdminWithdrawalRequests.css';
import axios from 'axios';

const AdminWithdrawalRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch withdrawal requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/admin/withdrawal-requests');
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching withdrawal requests:', err);
        setError('Failed to load withdrawal requests.');
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Approve or reject a request
  const handleAction = async (id, action) => {
    try {
      const response = await axios.post(`http://localhost:8081/api/admin/withdrawal-requests/${id}`, {
        action,
      });
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.withdrawal_id === id ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' } : req
        )
      );
      alert(`Request ${action}ed successfully.`);
    } catch (err) {
      console.error('Error processing request:', err);
      alert('Failed to process the request. Please try again.');
    }
  };

  if (loading) return <div>Loading withdrawal requests...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-withdrawal-requests">
      <h1>Withdrawal Requests</h1>
      {requests.length === 0 ? (
        <p>No withdrawal requests found.</p>
      ) : (
        <table className="withdrawal-requests-table">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.withdrawal_id}>
                <td>{request.applicantName}</td>
                <td>{request.reason}</td>
                <td>{new Date(request.withdrawn_at).toLocaleDateString()}</td>
                <td>{request.status}</td>
                <td>
                  {request.status === 'Pending' && (
                    <>
                      <button onClick={() => handleAction(request.withdrawal_id, 'approve')} className="approve-button">
                        Approve
                      </button>
                      <button onClick={() => handleAction(request.withdrawal_id, 'reject')} className="reject-button">
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminWithdrawalRequests;
