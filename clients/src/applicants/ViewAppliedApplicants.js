import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAppliedApplicants.css';

function ViewAppliedApplicants() {
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to map status ID to its label
    const getStatusLabel = (statusId) => {
        switch (statusId) {
            case 1:
                return "Active";
            case 2:
                return "Inactive";
            case 3:
                return "Pending";
            case 4:
                return "Hired"; // Status for hired applicants
            case 5:
                return "Rejected"; // Status for rejected applicants
            default:
                return "Unknown";
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Get employer ID from local storage
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
            setSelectedApplicant(response.data);
        } catch (err) {
            console.error("Error fetching applicant details:", err);
            setError("Failed to fetch applicant details.");
        } finally {
            setLoading(false);
        }
    };

    const hireApplicant = async (applicationId) => {
        try {
            const response = await axios.put(
                `http://localhost:8081/api/applicants/${applicationId}/hire`,
                { status_id: 4 }, // Set status to 'Hired' (4)
                { withCredentials: true }
            );
            alert("Applicant successfully hired!");
            viewDetails(applicationId); // Refresh the details to reflect updated status
        } catch (err) {
            console.error("Error hiring applicant:", err);
            alert("Failed to hire applicant. Please try again.");
        }
    };
    
    const rejectApplicant = async (applicationId) => {
        try {
            const response = await axios.put(
                `http://localhost:8081/api/applicants/${applicationId}/reject`,
                { status_id: 5 }, // Set status to 'Rejected' (5)
                { withCredentials: true }
            );
            alert("Applicant successfully rejected!");
            viewDetails(applicationId); // Refresh the details to reflect updated status
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

            {/* Display applicant details if one is selected */}
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
                        <li>
                            {selectedApplicant.picture_base64 && (
                                <>
                                    <h5>Picture:</h5>
                                    <img 
                                        src={`data:image/jpeg;base64,${selectedApplicant.picture_base64}`} 
                                        alt="Applicant Picture" 
                                        style={{ maxWidth: '300px', maxHeight: '300px' }}
                                    />
                                    <br />
                                    <a 
                                        href={`data:image/jpeg;base64,${selectedApplicant.picture_base64}`} 
                                        download="applicant_picture.jpg"
                                    >
                                        Download Picture
                                    </a>
                                </>
                            )}
                        </li>
                        <li>
                            {selectedApplicant.resume_base64 && (
                                <>
                                    <h5>Resume:</h5>
                                    <a 
                                        href={`data:application/pdf;base64,${selectedApplicant.resume_base64}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        View Resume
                                    </a>
                                    <br />
                                    <a 
                                        href={`data:application/pdf;base64,${selectedApplicant.resume_base64}`} 
                                        download="resume.pdf"
                                    >
                                        Download Resume
                                    </a>
                                </>
                            )}
                        </li>
                        <li>
                            {selectedApplicant.validId_base64 && (  
                                <>
                                    <h5>Valid ID:</h5>
                                    <a 
                                        href={`data:image/jpeg;base64,${selectedApplicant.validId_base64}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
                                        View Valid ID
                                    </a>
                                    <br />
                                    <a 
                                        href={`data:image/jpeg;base64,${selectedApplicant.validId_base64}`} 
                                        download="valid_id.jpg"
                                    >
                                        Download Valid ID
                                    </a>
                                </>
                            )}
                        </li>
                    </ul>
                    <button
                        className="hire-button"
                        onClick={() => hireApplicant(selectedApplicant.application_id)}
                        disabled={selectedApplicant.status_id === 4} // Disable if already hired
                    >
                        {selectedApplicant.status_id === 4 ? "Already Hired" : "Hire Applicant"}
                    </button>

                    {/* Reject button */}
                    <button
                        className="reject-button"
                        onClick={() => rejectApplicant(selectedApplicant.application_id)}
                        disabled={selectedApplicant.status_id === 5} // Disable if already rejected
                    >
                        {selectedApplicant.status_id === 5 ? "Already Rejected" : "Reject Applicant"}
                    </button>
                </div>
            ) : (
                // Display applicants list as before
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
        </div>
    );
}

export default ViewAppliedApplicants;
