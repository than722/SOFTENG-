import React, { useState, useEffect } from "react";
import "./CreateAcc.css";
import axios from "axios";

const CreateAcc = ({ isSelectionOpen, onCloseSelection, onFormSubmit }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [values, setValues] = useState({
    email: "",
    password: "",
    reEnterPassword: "",
    lastName: "",
    firstName: "",
    middleName: "",
    province: "",
    municipality: "",
    barangay: "",
    zipCode: "",
    mobileNumber: "",
    companyName: "",
    civil_status: "single", // Default to single
    birthday: "", // Added birthday field
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [files, setFiles] = useState({
    validId: null,
    picture: null,
    resume: null,
    birth_certificate: null,
    passport: null,
    marriage_contract: null,
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    validId: false,
    picture: false,
    resume: false,
    birth_certificate: false,
    passport: false,
    marriage_contract: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const openForm = (type) => {
    setAccountType(type);
    setIsFormOpen(true);
    onCloseSelection();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "reEnterPassword") {
      setPasswordMatch(value === values.password);
    }

    // Validate birthday
    if (name === "birthday") {
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 45, today.getMonth(), today.getDate()); // 45 years ago
      const maxDate = new Date(today.getFullYear() - 23, today.getMonth(), today.getDate()); // 23 years ago

      const selectedDate = new Date(value);
      if (selectedDate < minDate || selectedDate > maxDate) {
        setError("Birthday must indicate an age between 23 and 45.");
        return;
      } else {
        setError("");
      }
    }

    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (event) => {
    const { name, files: fileList } = event.target;
    const file = fileList[0];
    if (!file) return;

    setFiles((prevFiles) => ({ ...prevFiles, [name]: file }));
    setUploadedFiles((prevUploaded) => ({ ...prevUploaded, [name]: true }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!accountType) {
      setError("Please select an account type.");
      return;
    }
  
    // Ensure all required fields are filled, or handle validation
    if (!values.email || !values.password || !values.firstName || !values.lastName) {
      setError("Please fill in all required fields.");
      return;
    }
  
    // Ensure password match
    if (values.password !== values.reEnterPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    const formData = new FormData();
  
    // Append common fields
    formData.append("accountType", accountType); // Explicitly adding accountType
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        formData.append(key, values[key]);
      }
    });
  
    // Append files
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });
  
    setLoading(true);
    setError(""); // Clear previous error
  
    try {
      const response = await axios.post("http://localhost:8081/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Signup successful:", response.data);
      onFormSubmit(response.data);
      closeForm();
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const closeForm = () => {
    setIsFormOpen(false);
    setAccountType("");
    setValues({
      email: "",
      password: "",
      reEnterPassword: "",
      lastName: "",
      firstName: "",
      middleName: "",
      province: "",
      municipality: "",
      barangay: "",
      zipCode: "",
      mobileNumber: "",
      companyName: "",
      civil_status: "single",
      birthday: "",
    });
    setFiles({
      validId: null,
      picture: null,
      resume: null,
      birth_certificate: null,
      passport: null,
      marriage_contract: null,
    });
    setUploadedFiles({
      validId: false,
      picture: false,
      resume: false,
      birth_certificate: false,
      passport: false,
      marriage_contract: false,
    });
    setError("");
  };

  useEffect(() => {
    console.log("Current Account Type:", accountType);
  }, [accountType]);

  if (!isSelectionOpen && !isFormOpen) return null;

  const renderUploadField = (name, label, accept) => (
    <div className="form-group-App">
      <label>{label}:</label>
      <input type="file" name={name} accept={accept} onChange={handleFileChange} />
      {uploadedFiles[name] && (
        <span style={{ color: "green", fontWeight: "bold", marginLeft: "10px" }}>
          ✓ Uploaded
        </span>
      )}
    </div>
  );

  return (
    <div>
      {isSelectionOpen && (
        <div className="modal-App">
          <div className="modal-content-App">
            <span className="close-button-App" onClick={onCloseSelection}>
              &times;
            </span>
            <h2>Select Account Type</h2>
            <button
              className="account-type-button-App"
              onClick={() => openForm("employee")}
            >
              Employee
            </button>
            <button
              className="account-type-button-App"
              onClick={() => openForm("employer")}
            >
              Employer
            </button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="modal-App">
          <div className="modal-content-App">
            <span className="close-button-App" onClick={closeForm}>
              &times;
            </span>
            <h2>{accountType === "employee" ? "Employee Form" : "Employer Form"}</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="form-group-App">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="form-group-App">
                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  required
                  onChange={handleChange}
                />
              </div>
              <div className="form-group-App">
                <label>Re-enter Password:</label>
                <input
                  type="password"
                  name="reEnterPassword"
                  placeholder="Re-enter Password"
                  required
                  onChange={handleChange}
                />
                {values.reEnterPassword && (
                  <p style={{ color: passwordMatch ? "green" : "red" }}>
                    {passwordMatch ? "Passwords match!" : "Passwords do not match"}
                  </p>
                )}
              </div>
              <div className="form-group-App">
                <label>Birthday:</label>
                <input
                  type="date"
                  name="birthday"
                  value={values.birthday}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Common Fields */}
              {["lastName", "firstName", "middleName", "province", "municipality", "barangay", "zipCode", "mobileNumber"].map((field) => (
                <div className="form-group-App" key={field}>
                  <label>{field.replace(/([A-Z])/g, " $1")}:</label>
                  <input
                    type={field === "zipCode" ? "number" : "text"}
                    name={field}
                    placeholder={field.replace(/([A-Z])/g, " $1")}
                    required
                    onChange={handleChange}
                  />
                </div>
              ))}

              {/* Upload Valid ID for Both Employee and Employer */}
              {renderUploadField("validId", "Upload Valid ID", "image/*")}

              {/* Employer-Specific Fields */}
              {accountType === "employer" && (
                <div className="form-group-App">
                  <label>Company Name:</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    required
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Employee-Specific Fields */}
              {accountType === "employee" && (
                <>
                  <div className="form-group-App">
                    <label>Marital Status:</label>
                    <select
                      name="civil_status"
                      value={values.civil_status}
                      onChange={handleChange}
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                    </select>
                  </div>
                  {renderUploadField("picture", "Upload Picture", "image/*")}
                  {renderUploadField("resume", "Upload Resume", ".pdf,.doc,.docx")}
                  {renderUploadField("birth_certificate", "Upload Birth Certificate", "image/*")}
                  {renderUploadField("passport", "Upload Passport (Optional)", "image/*")}
                  {values.civil_status === "married" &&
                    renderUploadField("marriage_contract", "Upload Marriage Contract", "image/*")}
                </>
              )}

              <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAcc;
