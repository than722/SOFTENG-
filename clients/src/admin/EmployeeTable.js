import React from 'react';
import ProgressBar from '../Progress/ProgressBar';
import './Admin.css';

const EmployeeTable = ({ employees, viewProfile }) => {
  return (
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
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>
                {employee.firstName} {employee.lastName}
              </td>
              <td>
                {/* Use employee.id here instead of employeeId */}
                <ProgressBar employeeId={employee.id} />
              </td>
              <td>
                <button onClick={() => viewProfile(employee)}>View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
