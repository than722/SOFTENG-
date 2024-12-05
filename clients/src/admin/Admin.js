import React, { useState, useEffect } from 'react';
import './Admin.css';
import AdminWithdrawalRequests from './AdminWithdrawalRequests';
import EmployeeTable from './EmployeeTable';
import EmployerTable from './EmployerTable';
import Tabs from './Tabs';
import LoginAdmin from './LoginAdmin';
import ViewProfile from './ViewProfile';
import SignOutAdmin from './SignOutAdmin';

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('employees');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:8081/api/users')
        .then((response) => {
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          const updatedData = data.map((user) => ({
            ...user,
            currentStep: user.currentStep && user.currentStep >= 1 ? user.currentStep : 1,
          }));

          setEmployees(updatedData.filter((user) => user.userType === 'Employee'));
          setEmployers(updatedData.filter((user) => user.userType === 'Employer'));
        })
        .catch((err) => setError(err.message));
    }

  }, [isLoggedIn]);

  const deleteRejected = () => {
    fetch('http://localhost:8081/api/users/rejected', { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) throw new Error(`Delete failed: ${response.status}`);
        setEmployees((prev) => prev.filter((emp) => emp.progressId !== 2));
        setEmployers((prev) => prev.filter((emp) => emp.progressId !== 2));
      })
      .catch((err) => setError(err.message));
  };

  const viewProfile = (user) => {
    const userId = user.id;
    const userType = user.userType.toLowerCase();

    if (!userId) {
      setError('User ID is missing.');
      return;
    }

    fetch(`http://localhost:8081/api/users/${userId}?userType=${userType}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch user details');
        return response.json();
      })
      .then((data) => {
        setSelectedUser({ ...user, ...data });
        setShowModal(true);
      })
      .catch((err) => setError(err.message));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDeficiencyRequest = (applicantId, fileType) => {
    fetch('http://localhost:8081/api/deficiencies/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicantId,
        requiredFiles: [fileType],
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to send deficiency request');
        alert(`Deficiency request for ${fileType} sent successfully.`);
      })
      .catch((err) => {
        console.error('Failed to send deficiency request:', err);
        alert('Failed to send deficiency request. Please try again.');
      });
  };

  return (
    <div className="admin-container">
      {!isLoggedIn ? (
        <LoginAdmin setIsLoggedIn={setIsLoggedIn} />
      ) : (
        <>
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
            {/* Add SignOut button */}
            <SignOutAdmin setIsLoggedIn={setIsLoggedIn} />
          </div>
          <button onClick={deleteRejected}>Delete All Rejected Applicants</button>
          {error && <p className="error">Error: {error}</p>}
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'employees' && (
            <EmployeeTable
              employees={employees}
              viewProfile={viewProfile}
            />
          )}
          {activeTab === 'employers' && (
            <EmployerTable
              employers={employers}
              viewProfile={viewProfile}
            />
          )}
          {activeTab === 'withdrawalRequests' && <AdminWithdrawalRequests />}
          {showModal && selectedUser && (
            <ViewProfile
              user={selectedUser}
              closeModal={closeModal}
              acceptUser={() => {
                closeModal();
              }}
              rejectUser={() => {
                closeModal();
              }}
              handleDeficiencyRequest={(id, fileType) =>
                handleDeficiencyRequest(id, fileType)
              }
            />
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
