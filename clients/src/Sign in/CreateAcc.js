import React, { useState } from 'react';
import './CreateAcc.css'; // Add separate CSS if needed for styling
import axios from 'axios'; // Import axios for API requests

const CreateAcc = ({ isSelectionOpen, onCloseSelection, onFormSubmit }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [values, setValues] = useState({
    email: '',
    password: '',
    reEnterPassword: '',
    lastName: '',
    firstName: '',
    middleName: '',
    province: '',
    municipality: '',
    barangay: '',
    zipCode: '',
    mobileNumber: '',
    companyName: '',
  });
  const [picture, setPicture] = useState(null);
  const [resume, setResume] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const openForm = (type) => {
    setAccountType(type);
    setIsFormOpen(true);
    onCloseSelection();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'reEnterPassword') {
      setPasswordMatch(value === values.password);
    }
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (event) => {
    const { name, files } = event.target;
    if (name === 'picture') {
      setPicture(files[0]);
      console.log('Selected picture:', files[0]);
    }
    if (name === 'resume') {
      setResume(files[0]);
      console.log('Selected resume:', files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!passwordMatch) {
      setError('Passwords do not match');
      return;
    }

    // Password validation
    if (values.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    if (picture) formData.append('picture', picture);
    if (resume) formData.append('resume', resume);
    formData.append('accountType', accountType);

    console.log('FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    setLoading(true); // Start loading
    try {
      const response = await axios.post('http://localhost:8081/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Signup successful:', response.data);
      onFormSubmit(response.data);
      closeForm();
    } catch (error) {
      console.error('Error during signup:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || 'Signup failed. Please try again.'); // Show specific error
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setAccountType('');
    setValues({
      email: '',
      password: '',
      reEnterPassword: '',
      lastName: '',
      firstName: '',
      middleName: '',
      province: '',
      municipality: '',
      barangay: '',
      zipCode: '',
      mobileNumber: '',
      companyName: '',
    });
    setPicture(null);  // Reset picture
    setResume(null);   // Reset resume
    setError('');
  };

  if (!isSelectionOpen && !isFormOpen) return null;

  return (
    <div>
      {isSelectionOpen && (
        <div className="modal-App">
          <div className="modal-content-App">
            <span className="close-button-App" onClick={onCloseSelection}>&times;</span>
            <h2>Select Account Type</h2>
            <button className="account-type-button-App" onClick={() => openForm('employee')}>Employee</button>
            <button className="account-type-button-App" onClick={() => openForm('employer')}>Employer</button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="modal-App">
          <div className="modal-content-App">
            <span className="close-button-App" onClick={closeForm}>&times;</span>
            <h2>{accountType === 'employee' ? 'Employee Form' : 'Employer Form'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group-App">
                <label>Email:</label>
                <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>Password:</label>
                <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>Re-enter Password:</label>
                <input type="password" name="reEnterPassword" placeholder="Re-enter Password" required onChange={handleChange} />
                {values.reEnterPassword && (
                  <p style={{ color: passwordMatch ? 'green' : 'red' }}>
                    {passwordMatch ? 'Passwords match!' : 'Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Additional form fields */}
              <div className="form-group-App">
                <label>Last Name:</label>
                <input type="text" name="lastName" placeholder="Last Name" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>First Name:</label>
                <input type="text" name="firstName" placeholder="First Name" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>Middle Name:</label>
                <input type="text" name="middleName" placeholder="Middle Name" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>Province:</label>
                <input type="text" name="province" placeholder="Province" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>Municipality:</label>
                <input type="text" name="municipality" placeholder="Municipality" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>Barangay:</label>
                <input type="text" name="barangay" placeholder="Barangay" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>Zip Code:</label>
                <input type="number" name="zipCode" placeholder="Zip Code" required onChange={handleChange} />
              </div>
              <div className="form-group-App">
                <label>Mobile Number:</label>
                <input type="tel" name="mobileNumber" placeholder="Mobile Number" required onChange={handleChange} />
              </div>

              {/* Company Name field for Employer only */}
              {accountType === 'employer' && (
                <div className="form-group-App">
                  <label>Company Name:</label>
                  <input type="text" name="companyName" placeholder="Company Name" required onChange={handleChange} />
                </div>
              )}

              {accountType === 'employee' && (
                <>
                  <div className="form-group-App">
                    <label>Upload Picture:</label>
                    <input type="file" name="picture" accept="image/*" onChange={handleFileChange} required />
                  </div>
                  <div className="form-group-App">
                    <label>Upload Resume:</label>
                    <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                  </div>
                </>
              )}

              <button type="submit" className="App" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAcc;
