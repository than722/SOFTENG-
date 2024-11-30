import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAppliedApplicants.css';

function ViewAppliedApplicants() {
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            } catch (err) {
                console.error("Error fetching applicants:", err);
                setError("Failed to fetch applicants.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, []);

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
        <div className="view-applied-applicants">
            <h2>Applicants for Your Job Postings</h2>

            {selectedApplicant ? (
                <div className="applicant-details-container">
                    <button onClick={() => setSelectedApplicant(null)}>Back to List</button>
                    <h3>{selectedApplicant.firstName} {selectedApplicant.lastName}</h3>
                    <p><strong>Email:</strong> {selectedApplicant.email}</p>
                    <p><strong>Province:</strong> {selectedApplicant.province}</p>
                    <p><strong>Municipality:</strong> {selectedApplicant.municipality}</p>
                    <p><strong>Barangay:</strong> {selectedApplicant.barangay}</p>
                    <p><strong>Zip Code:</strong> {selectedApplicant.zipCode}</p>
                    <p><strong>Status:</strong> {getStatusLabel(selectedApplicant.status_id)}</p>
                    <h4>Uploaded Documents:</h4>
                    <ul>
                        {selectedApplicant.picture_base64 && (
                            <li>
                                <h5>Picture:</h5>
                                <img 
                                    src={selectedApplicant.picture_base64} 
                                    alt="Applicant Picture" 
                                    style={{ maxWidth: '300px', maxHeight: '300px' }} 
                                />
                                <br />
                                <a 
                                    href={selectedApplicant.picture_base64} 
                                    download="applicant_picture.jpg"
                                >
                                    Download Picture
                                </a>
                            </li>
                        )}
                        {selectedApplicant.resume_base64 && (
                            <li>
                                <h5>Resume:</h5>
                                <a 
                                    href={selectedApplicant.resume_base64} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    View Resume
                                </a>
                                <br />
                                <a 
                                    href={selectedApplicant.resume_base64} 
                                    download="resume.pdf"
                                >
                                    Download Resume
                                </a>
                            </li>
                        )}
                        {selectedApplicant.validId_base64 && (
                            <li>
                                <h5>Valid ID:</h5>
                                <a 
                                    href={selectedApplicant.validId_base64} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    View Valid ID
                                </a>
                                <br />
                                <a 
                                    href={selectedApplicant.validId_base64} 
                                    download="valid_id.jpg"
                                >
                                    Download Valid ID
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
                                        <p><strong>Email:</strong> {applicant.email}</p>
                                        <p><strong>Job:</strong> {applicant.jobName}</p>
                                        <p><strong>Applied on:</strong> {new Date(applicant.apply_date).toLocaleDateString()}</p>
                                        <p><strong>Status:</strong> {getStatusLabel(applicant.status_id)}</p>
                                        <button onClick={() => viewDetails(applicant.applications_id)}>View Details</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );
}

export default ViewAppliedApplicants;
