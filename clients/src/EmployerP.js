import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Keep the same CSS styling as App.js
import logo from './assets/images/logo4.png';

const EmployerP = ({ onSignOut }) => {
  return (
    <div className="employer-page-container">
      {/* Custom header for the employer page */}
      <header className="navbar-App">
        <img src={logo} alt="Logo" className="logo-App" />
        <nav>
          <ul>
            <li><a href="#about">ABOUT US</a></li>
            <li><a href="#vision">VISION</a></li>
            <li><a href="#mission">MISSION</a></li>
            <li><Link to="/add-job">Add Job Posting</Link></li>
          </ul>
        </nav>
        <div className="button2">
          {/* Replace the Sign In button with Sign Out */}
          <button className="sign-out-App" onClick={onSignOut}>SIGN OUT</button>
        </div>
      </header>

      {/* Main content for the employer page */}
      <main className="content-App">
        <div className="text-section-App">
          <h1 className="company-name-App">MMML</h1>
          <h2 className="tagline-App">Recruitment Services Corporated</h2>
          <p className="description-App">
            Maddy, Minette, Miles, Lollie "MMML" was founded in 1999 in Manila with its mission to assist Filipinos in finding jobs abroad.
            Its initial focus is domestic helpers in Kuwait and Bahrain. Its current reach is multiple countries and diverse jobs,
            having recognition from the POEA, OWWA, and DOLE. The corporation specializes in marketing and HR training with a goal of
            employer and client satisfaction, aiming for improved local employment rate and awards for exceptional services.
          </p>
        </div>

        <div className="image-section-App">
          <img src="woman-smiling.png" alt="Smiling Woman" className="main-image-App" />
        </div>
      </main>
    </div>
  );
};

export default EmployerP;
