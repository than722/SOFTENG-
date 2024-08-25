import React, { useState } from 'react';
import './App.css';  // Assuming you have a separate CSS file
import logo from './assets/images/logo4.png';

const App = () => {
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [accountType, setAccountType] = useState(''); // State for account type

  const openSelectionModal = () => {
    setIsSelectionModalOpen(true);
  };

  const closeSelectionModal = () => {
    setIsSelectionModalOpen(false);
  };

  const openFormModal = (type) => {
    setAccountType(type);
    setIsFormModalOpen(true);
    closeSelectionModal();
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setAccountType('');
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <nav>
          <ul>
            <li><a href="#about">ABOUT US</a></li>
            <li><a href="#vision">VISION</a></li>
            <li><a href="#mission">MISSION</a></li>
          </ul>
        </nav>
        <button className="create-account" onClick={openSelectionModal}>CREATE ACCOUNT</button>
      </header>

      <main className="content">
        <div className="text-section">
          <h1 className="company-name">MMML</h1>
          <h2 className="tagline">Recruitment Services Corporated</h2>
          <p className="description">
            Maddy, Minette, Miles, Lollie "MMML" was founded in 1999 in Manila with its mission to assist Filipinos in finding jobs abroad. 
            Its initial focus are domestic helpers in Kuwait and Bahrain. Its current reach are multiple countries and diverse jobs, 
            having recognition from the POEA, OWWA, and DOLE. The corporation expertises in marketing and HR training with a goal of 
            employer and client satisfaction, aiming for improved local employment rate and awards for exceptional services.
          </p>
          <button className="sign-up">SIGN UP</button>
        </div>

        <div className="image-section">
          <img src="woman-smiling.png" alt="Smiling Woman" className="main-image" /> {/* Replace with actual image */}
        </div>
      </main>

      {/* Selection Modal */}
      {isSelectionModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeSelectionModal}>&times;</span>
            <h2>Select Account Type</h2>
            <button className="account-type-button" onClick={() => openFormModal('employee')}>Employee</button>
            <button className="account-type-button" onClick={() => openFormModal('employer')}>Employer</button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isFormModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeFormModal}>&times;</span>
            <h2>{accountType === 'employee' ? 'Employee Form' : 'Employer Form'}</h2>
            <form>
              <div className="form-group">
                <label>Last Name:</label>
                <input type="text" name="lastName" placeholder="Last Name" required />
              </div>
              <div className="form-group">
                <label>First Name:</label>
                <input type="text" name="firstName" placeholder="First Name" required />
              </div>
              <div className="form-group">
                <label>Middle Name:</label>
                <input type="text" name="middleName" placeholder="Middle Name" />
              </div>
              <div className="form-group">
                <label>Address:</label>
                <input type="text" name="province" placeholder="Province" required />
                <input type="text" name="municipality" placeholder="Municipality" required />
                <input type="text" name="barangay" placeholder="Barangay" required />
                <input type="text" name="zipcode" placeholder="Zip Code" required />
              </div>
              <div className="form-group">
                <label>Mobile Number:</label>
                <input type="text" name="mobileNumber" placeholder="Mobile Number" required />
              </div>
              {accountType === 'employer' && (
                <div className="form-group">
                  <label>Company Name (optional):</label>
                  <input type="text" name="companyName" placeholder="Company Name" />
                </div>
              )}
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
