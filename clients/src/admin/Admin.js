import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user
  const [showModal, setShowModal] = useState(false); // State to toggle modal

  useEffect(() => {
    // Fetch data from the backend
    fetch('/api/users')
      .then(response => response.json())
      .then(data => {
        const employeesData = data.filter(user => user.type === 'Employee');
        const employersData = data.filter(user => user.type === 'Employer');
        setEmployees(employeesData);
        setEmployers(employersData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleStatusChange = (id, newStatus, userType) => {
    fetch(`/api/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(response => {
        if (response.ok) {
          if (userType === 'Employee') {
            setEmployees(prevState =>
              prevState.map(emp =>
                emp.id === id ? { ...emp, status: newStatus } : emp
              )
            );
          } else {
            setEmployers(prevState =>
              prevState.map(emp =>
                emp.id === id ? { ...emp, status: newStatus } : emp
              )
            );
          }
        } else {
          console.error('Failed to update status');
        }
      })
      .catch(error => console.error('Error updating status:', error));
  };

  const deleteRejected = () => {
    setEmployees(prevState => prevState.filter(emp => emp.status !== 'Rejected'));
    setEmployers(prevState => prevState.filter(emp => emp.status !== 'Rejected'));

    fetch('/api/users/rejected', {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          console.error('Failed to delete rejected applicants');
        }
      })
      .catch(error => console.error('Error deleting rejected applicants:', error));
  };

  const viewProfile = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      <button onClick={deleteRejected}>Delete All Rejected Applicants</button>

      {/* Employees Table */}
      <h2>Employees</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.type}</td>
              <td>
                <select
                  value={employee.status}
                  onChange={(e) => handleStatusChange(employee.id, e.target.value, 'Employee')}
                >
                  <option value="Accepted">Accepted</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>
                <button onClick={() => viewProfile(employee)}>View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Employers Table */}
      <h2>Employers</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.map(employer => (
            <tr key={employer.id}>
              <td>{employer.id}</td>
              <td>{employer.name}</td>
              <td>{employer.type}</td>
              <td>
                <select
                  value={employer.status}
                  onChange={(e) => handleStatusChange(employer.id, e.target.value, 'Employer')}
                >
                  <option value="Accepted">Accepted</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </td>
              <td>
                <button onClick={() => viewProfile(employer)}>View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Viewing Profile */}
      {showModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedUser.name}'s Profile</h2>
            <img src={selectedUser.pictureUrl} alt={`${selectedUser.name}'s profile`} className="profile-picture" />
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Type:</strong> {selectedUser.type}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <a href={selectedUser.resumeUrl} download={`${selectedUser.name}-resume.pdf`} className="download-resume">
              Download Resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
