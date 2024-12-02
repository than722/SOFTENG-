import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderEmployer.css'; // Scoped CSS for header
import logo from '../assets/images/MMMLCropped.png';
import SignOut from '../Sign in/SignOut'; // Import SignOut component

const HeaderEmployer = ({ userId, unreadCount, onSignOut }) => {
    return (
        <header className="header-employer-navbar">
            <img src={logo} alt="Logo" className="header-employer-logo" />
            <nav className="header-employer-nav">
                <ul>
                    <li><a href="#about">ABOUT US</a></li>
                    <li><a href="#vision">VISION</a></li>
                    <li><a href="#mission">MISSION</a></li>
                    <li><Link to="/add-job">Add Job Posting</Link></li>
                    <li><Link to="/view-job">View Job Posting</Link></li>
                    <li><Link to={`/view-applied-applicants/${userId}`}>View Applied Applicants</Link></li>
                    {/* Always show Profile button if userId is available */}
                    {userId && (
                        <li><Link to={`/profile/${userId}/employer`}>Profile</Link></li>
                    )}
                     <li><Link to="/employer-notifications">Notifications</Link></li>
                    
                </ul>
            </nav>
            <div className="header-employer-button">
                {/* Use the SignOut component */}
                <SignOut onSignOut={onSignOut} />
            </div>
        </header>
    );
};

export default HeaderEmployer;
