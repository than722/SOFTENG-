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
                return "Hired"; // New status for hired applicants
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

        console.log("Employer ID from local storage:", userId);

        const fetchApplicants = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/applications/employer/${userId}`, {
                    withCredentials: true,
                });
                console.log("Applicants data:", response.data);
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
            console.log("Selected applicant details:", response.data);
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
                { status_id: 4 }, // Set status to 'Hired'
                { withCredentials: true }
            );
            console.log("Hire response:", response.data);
            alert("Applicant successfully hired!");

            // Refresh applicant details to show updated status
            viewDetails(applicationId);
        } catch (err) {
            console.error("Error hiring applicant:", err);
            alert("Failed to hire applicant. Please try again.");
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
                        <li><a href={selectedApplicant.picture_url} target="_blank" rel="noopener noreferrer">Picture</a></li>
                        <li><a href={selectedApplicant.resume_url} target="_blank" rel="noopener noreferrer">Resume</a></li>
                        <li><a href={selectedApplicant.valid_id_url} target="_blank" rel="noopener noreferrer">Valid ID</a></li>
                    </ul>
                    <button
                        className="hire-button"
                        onClick={() => hireApplicant(selectedApplicant.application_id)}
                        disabled={selectedApplicant.status_id === 4} // Disable if already hired
                    >
                        {selectedApplicant.status_id === 4 ? "Already Hired" : "Hire Applicant"}
                    </button>
                </div>
            ) : (
                /* Display applicants list */
                <>
                    {applicants.length === 0 ? (
                        <p className='note'>No one has applied for your jobs yet.</p>
                    ) : (
                        <ul className="applicants-list">
                            {applicants.map((applicant) => (
                                <li key={applicant.application_id} className="applicant-card">
                                    <div className="applicant-overview">
                                        <h3>{applicant.firstName} {applicant.lastName}</h3>
                                        <p><strong>Email:</strong> {applicant.email}</p>
                                        <p><strong>Job ID:</strong> {applicant.job_id}</p>
                                        <p><strong>Applied on:</strong> {new Date(applicant.apply_date).toLocaleDateString()}</p>
                                        <p><strong>Status:</strong> {getStatusLabel(applicant.status_id)}</p>
                                        <button onClick={() => viewDetails(applicant.application_id)}>View Details</button>
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
