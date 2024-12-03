import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAppliedApplicants.css';
import HeaderEmployer from '../Header/HeaderEmployer';
import { useLocation } from 'react-router-dom';

function ViewAppliedApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation(); // Get state passed during navigation
  const applicationId = location.state?.applicationId; // Get applicationId if passed

  const getStatusLabel = (statusId) => {
    switch (statusId) {
      case 1: return "Active";
      case 2: return "Inactive";
      case 3: return "Pending";
      case 4: return "Hired";
      case 5: return "Rejected";
      default: return "Unknown";
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error("Employer ID is missing.");
      setError("Invalid employer ID.");
      setLoading(false);
      return;
    }

    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/applications/employer/${userId}`, {
          withCredentials: true,
        });
        console.log("Fetched applicants:", response.data);
        setApplicants(response.data);

        // If applicationId is passed, fetch the applicant details immediately
        if (applicationId) {
          const applicantResponse = await axios.get(
            `http://localhost:8081/api/applicants/${applicationId}`,
            { withCredentials: true }
          );
          setSelectedApplicant(applicantResponse.data);
        }
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to fetch applicants.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [applicationId]);

  const viewDetails = async (applicationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8081/api/applicants/${applicationId}`, {
        withCredentials: true,
      });
      console.log("Applicant details:", response.data);
      setSelectedApplicant(response.data);
    } catch (err) {
      console.error("Error fetching applicant details:", err);
      setError("Failed to fetch applicant details.");
    } finally {
      setLoading(false);
    }
  };

    const hireApplicant = async (employeeId) => {
        if (!employeeId) {
            console.error("Employee ID is missing.");
            alert("Invalid employee ID.");
            return;
        }
    
        console.log("Hiring applicant with employee ID:", employeeId);
    
        try {
            // Step 1: Update the status to 'hired' (status_id: 4) for the employee
            const response = await axios.put(
                `http://localhost:8081/api/employees/${employeeId}/hire`,
                { status_id: 4 }, // Ensure the status is being sent as 4
                { withCredentials: true }
            );
    
            if (response.data.success) {
                alert("Applicant successfully hired!");
                setApplicants(prevApplicants =>
                    prevApplicants.map(applicant =>
                        applicant.employee_id === employeeId
                            ? { ...applicant, status_id: 4 }  // Update only the hired applicant's status
                            : applicant
                    )
                );
                setSelectedApplicant(null);  // Reset selected applicant after hire
            } else {
                alert("Failed to hire applicant.");
            }
        } catch (err) {
            console.error("Error hiring applicant:", err);
            alert("Failed to hire applicant. Please try again.");
        }
    };
    
    const rejectApplicant = async (employeeId) => {
        if (!employeeId) {
            console.error("Employee ID is missing.");
            alert("Invalid employee ID.");
            return;
        }
    
        console.log("Rejecting applicant with employee ID:", employeeId);
    
        try {
            // Step 1: Update the status to 'rejected' (status_id: 5) for the employee
            const response = await axios.put(
                `http://localhost:8081/api/employees/${employeeId}/reject`,
                { status_id: 5 }, // Ensure the status is being sent as 5
                { withCredentials: true }
            );
    
            if (response.data.success) {
                alert("Applicant successfully rejected!");
                setApplicants(prevApplicants =>
                    prevApplicants.map(applicant =>
                        applicant.employee_id === employeeId
                            ? { ...applicant, status_id: 5 }  // Update only the rejected applicant's status
                            : applicant
                    )
                );
                setSelectedApplicant(null);  // Reset selected applicant after rejection
            } else {
                alert("Failed to reject applicant.");
            }
        } catch (err) {
            console.error("Error rejecting applicant:", err);
            alert("Failed to reject applicant. Please try again.");
        }
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
                    <HeaderEmployer 
                userId={localStorage.getItem('userId')} 
                auth={true} 
                onSignOut={() => {
                    localStorage.clear();
                    window.location.href = '/';
                }} 
            />
        
        <div className="view-applied-applicants">
            <h2>Applicants for Your Job Postings</h2>

            {selectedApplicant ? (
                <div className="applicant-details-container">
                    <button className='backDetails' onClick={() => setSelectedApplicant(null)}>Back to List</button>
                    <h3>{selectedApplicant.firstName} {selectedApplicant.lastName}</h3>
                    <div className='details'>
                        <p><strong>Email:</strong> {selectedApplicant.email}</p>
                        <p><strong>Province:</strong> {selectedApplicant.province}</p>
                        <p><strong>City / Municipality:</strong> {selectedApplicant.municipality}</p>
                        <p><strong>Barangay:</strong> {selectedApplicant.barangay}</p>
                        <p><strong>Zip Code:</strong> {selectedApplicant.zipCode}</p>
                        <p><strong>Status:</strong> {getStatusLabel(selectedApplicant.status_id)}</p>    
                    </div>
                    
                    <h4 className='uploaded'>Uploaded Documents:</h4>
                    <ul>
                    {selectedApplicant.picture_url && (
                            <li>
                                <h5 className='documents'>Picture:</h5>
                                <img 
                                    src={`http://localhost:8081${selectedApplicant.picture_url}`} 
                                    alt="Applicant Picture" 
                                    style={{ maxWidth: '150px', maxHeight: '150px' }} 
                                />
                            </li>
                        )}

                        {selectedApplicant.resume_url && (
                            <li>
                                <h5 className='documents'>Resume:</h5>
                                <a className='download'
                                    href={`http://localhost:8081${selectedApplicant.resume_url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    View Resume
                                </a>
                            </li>
                        )}

                        {selectedApplicant.valid_id_url && (
                            <li>
                                <h5 className='documents'>Valid ID:</h5>
                                <a className='download'
                                    href={`http://localhost:8081${selectedApplicant.valid_id_url}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    View Valid ID
                                </a>
                            </li>
                        )}
                    </ul>
                    <button
                        className="hire-button"
                        onClick={() => hireApplicant(selectedApplicant.employee_id)}
                        disabled={selectedApplicant.status_id === 4}
                    >
                        {selectedApplicant.status_id === 4 ? "Already Hired" : "Hire Applicant"}
                    </button>
                    <button
                        className="reject-button"
                        onClick={() => rejectApplicant(selectedApplicant.employee_id)}
                        disabled={selectedApplicant.status_id === 5}
                    >
                        {selectedApplicant.status_id === 5 ? "Already Rejected" : "Reject Applicant"}
                    </button>
                </div>
            ) : (
                <>
                    {applicants.length === 0 ? (
                        <div>No one has applied yet.</div>
                    ) : (
                        <ul className="applicants-list">
                            {applicants.map((applicant) => (
                                <li key={applicant.applications_id} className="applicant-card">
                                    <div className="applicant-overview">
                                        <h3>{applicant.firstName} {applicant.lastName}</h3>
                                        <p className='details'><strong>Email:</strong> {applicant.email}</p>
                                        <p className='details'><strong>Job:</strong> {applicant.jobName}</p>
                                        <p className='details'><strong>Applied on:</strong> {new Date(applicant.apply_date).toLocaleDateString()}</p>
                                        <p className='details'><strong>Status:</strong> {getStatusLabel(applicant.status_id)}</p>
                                        <button className='viewDetails' onClick={() => viewDetails(applicant.applications_id)}>View Details</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
        </>
    );
}

export default ViewAppliedApplicants;
