import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile-table.css';

const ProfileTable = () => {
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [activeTab, setActiveTab] = useState('employees');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8081/api/users')
      .then(response => response.json())
      .then(data => {
        const employeesData = data.filter(user => user.type === 'Employee');
        const employersData = data.filter(user => user.type === 'Employer');
        setEmployees(employeesData);
        setEmployers(employersData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const viewProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  return (
    <div className="profile-table-container">
      <div className="profile-table-tabs">
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
          <table className="profile-table-user-table">
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
                  <td>{employee.statusId === 1 ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button onClick={() => viewProfile(employee.id)}>View Profile</button>
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
          <table className="profile-table-user-table">
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
                  <td>{employer.statusId === 1 ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button onClick={() => viewProfile(employer.id)}>View Profile</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProfileTable;
