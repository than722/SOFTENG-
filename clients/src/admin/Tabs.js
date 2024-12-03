import React from 'react';
import './Admin.css';

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
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
      <button
        className={activeTab === 'withdrawalRequests' ? 'active' : ''}
        onClick={() => setActiveTab('withdrawalRequests')}
      >
        Withdrawal Requests
      </button>
    </div>
  );
};

export default Tabs;
