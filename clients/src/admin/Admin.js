import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null); 
  const [activeTab, setActiveTab] = useState('employees'); 

  useEffect(() => {
    fetch('http://localhost:8081/api/users')
      .then(response => {
        if (response.ok) {
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
        setError(error.message); 
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

      {error && <p>Error: {error}</p>} 

      {/* Tab navigation */}
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

      {/* Employees Table */}
      {activeTab === 'employees' && (
        <div>
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
                  <td>{employee.name}</td> 
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
        </div>
      )}

      {/* Employers Table */}
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
              {employers.map(employer => (
                <tr key={employer.id}>
                  <td>{employer.id}</td>
                  <td>{employer.name}</td> 
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
        </div>
      )}

      {/* Modal for displaying user profile */}
      {showModal && selectedUser && (
        <div className="modal-admin">
          <div className="modal-content-admin">
            <h2>{selectedUser.name}</h2> 
            {selectedUser.pictureUrl && <img src={`http://localhost:8081/uploads/${selectedUser.pictureUrl}`} alt="Profile" />}
            {selectedUser.resumeUrl && <a href={`http://localhost:8081/uploads/${selectedUser.resumeUrl}`} download>Download Resume</a>}
            <button className="close-admin" onClick={closeModal}>&times;</button> {/* Close button as an "X" */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
