import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null); // New state for error handling

  useEffect(() => {
    fetch('http://localhost:8081/api/users')
      .then(response => {
        if (response.ok) {
          // Check if response is JSON
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          } else {
            throw new Error('Expected JSON response but received: ' + contentType);
          }
        } else {
          throw new Error('Network response was not ok.');
        }
      })
      .then(data => {
        const employeesData = data.filter(user => user.type === 'Employee');
        const employersData = data.filter(user => user.type === 'Employer');
        setEmployees(employeesData);
        setEmployers(employersData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error.message); // Set the error state
      });
  }, []);

  const handleStatusChange = (id, newStatusId, userType) => {
    fetch(`/api/users/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ statusId: newStatusId }),
    })
      .then(response => {
        if (response.ok) {
          if (userType === 'Employee') {
            setEmployees(prevState =>
              prevState.map(emp =>
                emp.id === id ? { ...emp, statusId: newStatusId } : emp
              )
            );
          } else {
            setEmployers(prevState =>
              prevState.map(emp =>
                emp.id === id ? { ...emp, statusId: newStatusId } : emp
              )
            );
          }
        } else {
          throw new Error('Failed to update status: ' + response.statusText);
        }
      })
      .catch(error => console.error('Error updating status:', error));
  };

  const deleteRejected = () => {
    fetch('/api/users/rejected', {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setEmployees(prevState => prevState.filter(emp => emp.statusId !== 2));
          setEmployers(prevState => prevState.filter(emp => emp.statusId !== 2));
        } else {
          throw new Error('Failed to delete rejected applicants: ' + response.statusText);
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

      {error && <p>Error: {error}</p>} {/* Display error message */}

      {/* Employees Table */}
      <h2>Employees</h2>
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
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.firstName} {employee.middleName ? employee.middleName + ' ' : ''}{employee.lastName}</td>
              <td>
                <select
                  value={employee.statusId || ''}
                  onChange={(e) => handleStatusChange(employee.id, parseInt(e.target.value), 'Employee')}
                >
                  <option value={1}>Active</option>
                  <option value={2}>Inactive</option>
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
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employers.map(employer => (
            <tr key={employer.id}>
              <td>{employer.id}</td>
              <td>{employer.firstName} {employer.middleName ? employer.middleName + ' ' : ''}{employer.lastName}</td>
              <td>
                <select
                  value={employer.statusId || ''}
                  onChange={(e) => handleStatusChange(employer.id, parseInt(e.target.value), 'Employer')}
                >
                  <option value={1}>Active</option>
                  <option value={2}>Inactive</option>
                </select>
              </td>
              <td>
                <button onClick={() => viewProfile(employer)}>View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for displaying user profile */}
      {showModal && selectedUser && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedUser.firstName} {selectedUser.middleName ? selectedUser.middleName + ' ' : ''}{selectedUser.lastName}</h2>
            {selectedUser.pictureUrl && <img src={`http://localhost:8081/uploads/${selectedUser.pictureUrl}`} alt="Profile" />}
            {selectedUser.resumeUrl && <a href={`http://localhost:8081/uploads/${selectedUser.resumeUrl}`} download>Download Resume</a>}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
