import React from 'react';
import './Admin.css';

const EmployerTable = ({ employers, viewProfile }) => {
  return (
    <div className='employer-table'>
      <h2>Employers</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
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
                <button onClick={() => viewProfile(employer)}>View Profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployerTable;
