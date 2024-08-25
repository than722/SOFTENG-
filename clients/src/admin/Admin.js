import React from 'react';
import './Admin.css';

const Admin = () => {
  // Sample data - replace with actual data
  const employees = [
    { id: 1, name: 'John Doe', type: 'Employee', status: 'Active' },
    { id: 2, name: 'Jane Smith', type: 'Employer', status: 'Inactive' },
    // Add more employee data as needed
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.type}</td>
              <td>{employee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Admin;
