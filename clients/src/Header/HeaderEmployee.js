import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderEmployee.css'; // Scoped CSS for header
import logo from '../assets/images/MMMLCropped.png';
import SignOut from '../Sign in/SignOut'; // Import SignOut component

const HeaderEmployee = ({ userId, auth, onSignOut }) => {
  return (
    <header className="header-employee-navbar">
      <img src={logo} alt="Logo" className="header-employee-logo" />
      <nav className="header-employee-nav">
        <ul>
          <li><a href="#about">ABOUT US</a></li>
          <li><a href="#vision">VISION</a></li>
          <li><a href="#mission">MISSION</a></li>
          <li><Link to="/view-job">View Job Posting</Link></li>
          <li><Link to="/employee/:id/applied-jobs">View Applied Jobs</Link></li>
            {auth && userId && (
              <li><Link to={`/profile/${userId}/employee`}>Profile</Link></li> // Added /employee as accountType
            )}
          </ul>
      </nav>
      <div className="header-employee-button">
        {/* Use the SignOut component */}
        <SignOut onSignOut={onSignOut} />
      </div>
    </header>
  );
};

export default HeaderEmployee;
