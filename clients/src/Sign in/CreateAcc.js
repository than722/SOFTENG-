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
    maritalStatus: "single", // Default to single
  });
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [files, setFiles] = useState({
    validId: null,
    picture: null,
    resume: null,
    birthCert: null,
    passport: null,
    marriageContract: null,
  });
  const [uploadedFiles, setUploadedFiles] = useState({
    validId: false,
    picture: false,
    resume: false,
    birthCert: false,
    passport: false,
    marriageContract: false,
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
    setValues({ ...values, [name]: value });
  };

  const handleFileChange = (event) => {
    const { name, files: fileList } = event.target;
    const file = fileList[0];
    if (!file) return;

    const fileValidation = {
      validId: "image/*",
      picture: "image/*",
      resume: ".pdf,.doc,.docx",
      birthCert: "image/*",
      passport: "image/*",
      marriageContract: "image/*",
    };

    const allowedTypes = fileValidation[name].split(",");
    if (
      !allowedTypes.some((type) => file.type.includes(type.replace("*", "")))
    ) {
      setError(`Invalid file type for ${name}.`);
      return;
    }

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

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    formData.append("accountType", accountType);
    Object.keys(files).forEach((key) => {
      if (files[key]) formData.append(key, files[key]);
    });

    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8081/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Signup successful:", response.data);
      onFormSubmit(response.data);
      closeForm();
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.response?.data?.message || "Signup failed. Please try again.");
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
      maritalStatus: "single",
    });
    setFiles({
      validId: null,
      picture: null,
      resume: null,
      birthCert: null,
      passport: null,
      marriageContract: null,
    });
    setUploadedFiles({
      validId: false,
      picture: false,
      resume: false,
      birthCert: false,
      passport: false,
      marriageContract: false,
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

              {/* Employer Fields */}
              {accountType === "employer" &&
                renderUploadField("validId", "Upload Valid ID", "image/*")}

              {/* Employee Fields */}
              {accountType === "employee" && (
                <>
                  <div className="form-group-App">
                    <label>Marital Status:</label>
                    <select
                      name="maritalStatus"
                      value={values.maritalStatus}
                      onChange={handleChange}
                    >
                      <option value="single">Single</option>
                      <option value="married">Married</option>
                    </select>
                  </div>
                  {renderUploadField("picture", "Upload Picture", "image/*")}
                  {renderUploadField("resume", "Upload Resume", ".pdf,.doc,.docx")}
                  {renderUploadField("birthCert","Upload Birth Certificate","image/*")}
                  {renderUploadField("passport","Upload Passport (Optional)","image/*")}
                  {values.maritalStatus === "married" &&
                    renderUploadField("marriageContract","Upload Marriage Contract","image/*")}
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
