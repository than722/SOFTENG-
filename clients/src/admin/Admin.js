import React, { useState, useEffect } from 'react';
import ProgressBar from '../Progress/ProgressBar';
import './Admin.css';

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('employees');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const correctUsername = 'admin';
  const correctPassword = 'admin';

  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      setIsLoggedIn(true);
    } else {
      setError('Incorrect username or password');
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetch('http://localhost:8081/api/users')
        .then((response) => {
          if (!response.ok) throw new Error(`Error: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          setEmployees(data.filter((user) => user.userType === 'Employee'));
          setEmployers(data.filter((user) => user.userType === 'Employer'));
        })
        .catch((err) => setError(err.message));
    }
  }, [isLoggedIn]);

  const handleProgressChange = (id, newProgressId) => {
    fetch(`http://localhost:8081/api/users/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ progressId: newProgressId }),
    })
      .then((response) => {
        if (!response.ok) throw new Error(`Update failed: ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log(data); // Handle success
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  };
  
  

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
    // Log the user object to check its structure
    console.log(user); 
  
    const userId = user.id;  // Use the general 'id' field
    const userType = user.userType;  // 'Employee' or 'Employer'
    
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

  const acceptUser = () => {
    if (selectedUser) {
      handleProgressChange(selectedUser.id, 1, selectedUser.userType);
      closeModal();
    }
  };

  const rejectUser = () => {
    if (selectedUser) {
      handleProgressChange(selectedUser.id, 2, selectedUser.userType);
      closeModal();
    }
  };

  return (
    <div className="admin-container">
      {!isLoggedIn ? (
        <div className="login-form">
          <h2>Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-label="Username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Password"
          />
          <button onClick={handleLogin}>Login</button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <>
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
          </div>

          <button onClick={deleteRejected}>Delete All Rejected Applicants</button>

          {error && <p>Error: {error}</p>}

          <div className="tabs">
            <button
              className={activeTab === 'employees' ? 'active' : ''}
              onClick={() => setActiveTab('employees')}
            >
              Employees
            </button>
            <button
              className={activeTab === 'employers' ? 'active' : ''}
              onClick={() => setActiveTab('employers')}
            >
              Employers
            </button>
          </div>

          {activeTab === 'employees' && (
            <div>
              <h2>Employees</h2>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Progress</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td>
                        <ProgressBar currentStep={employee.progressId || 1} />
                      </td>
                      <td>
                        <select
                          value={employee.progressId || ''}
                          onChange={(e) =>
                            handleProgressChange(employee.id, parseInt(e.target.value), 'Employee')
                          }
                        >
                          <option value={1}>Step 1: Account Created</option>
                          <option value={2}>Step 2: Admin Approved</option>
                          <option value={3}>Step 3: Medical Done</option>
                          <option value={4}>Step 4: TESDA Certified</option>
                        </select>
                        <button onClick={() => viewProfile(employee)}>View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'employers' && (
            <div>
              <h2>Employers</h2>
              <table className="user-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employers.map((employer) => (
                    <tr key={employer.id}>
                      <td>{employer.id}</td>
                      <td>
                        {employer.firstName} {employer.lastName}
                      </td>
                      <td>
                        <ProgressBar currentStep={employer.progressId || 1} />
                      </td>
                      <td>
                        <select
                          value={employer.progressId || ''}
                          onChange={(e) =>
                            handleProgressChange(employer.id, parseInt(e.target.value), 'Employer')
                          }
                        >
                          <option value={1}>Step 1: Account Created</option>
                          <option value={2}>Step 2: Admin Approved</option>
                          <option value={3}>Step 3: Medical Done</option>
                          <option value={4}>Step 4: TESDA Certified</option>
                        </select>
                        <button onClick={() => viewProfile(employer)}>View Profile</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {showModal && selectedUser && (
            <div className="modal-admin">
              <div className="modal-content-admin">
                <div className="profile-header">
                  <h2>
                    {selectedUser.firstName} {selectedUser.lastName}'s Profile
                  </h2>
                  {selectedUser.pictureUrl && (
                    <div className="profile-picture">
                      <img
                        src={`http://localhost:8081/uploads/${selectedUser.pictureUrl}`}
                        alt="Profile"
                      />
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <p>
                    <strong>ID:</strong> {selectedUser.id}
                  </p>
                  <p>
                    <strong>First Name:</strong> {selectedUser.firstName}
                  </p>
                  <p>
                    <strong>Last Name:</strong> {selectedUser.lastName}
                  </p>
                  <p>
                    <strong>Province:</strong> {selectedUser.province}
                  </p>
                  <p>
                    <strong>Municipality:</strong> {selectedUser.municipality}
                  </p>
                  <p>
                    <strong>Barangay:</strong> {selectedUser.barangay}
                  </p>
                  <p>
                    <strong>Zip Code:</strong> {selectedUser.zipCode}
                  </p>
                  <p>
                    <strong>Mobile Number:</strong> {selectedUser.mobileNumber}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    {selectedUser.progressId === 1 ? 'Active' : selectedUser.progressId === 2 ? 'Inactive' : 'Pending'}
                  </p>
                  <p>
                    <strong>Resume:</strong>{' '}
                    <a
                      href={`http://localhost:8081/uploads/${selectedUser.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resume
                    </a>
                  </p>
                </div>
                <div className="modal-buttons">
                  <button onClick={acceptUser}>Accept</button>
                  <button onClick={rejectUser}>Reject</button>
                  <button onClick={closeModal}>Close</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
