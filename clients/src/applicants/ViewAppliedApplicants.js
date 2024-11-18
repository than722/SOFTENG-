import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewAppliedApplicants.css';

function ViewAppliedApplicants() {
    const [applicants, setApplicants] = useState([]);
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

    if (loading) return <div>Loading applicants...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="view-applied-applicants">
            <h2>Applicants for Your Job Postings</h2>
            {applicants.length === 0 ? (
                <p className='note'>No one has applied for your jobs yet.</p>
            ) : (
                <ul className="applicants-list">
                    {applicants.map((applicant) => (
                        <li key={applicant.application_id} className="applicant-card">
                            <div className="applicant-details">
                                <h3>{applicant.firstName} {applicant.lastName}</h3>
                                <p><strong>Email:</strong> {applicant.email}</p>
                                <p><strong>Job ID:</strong> {applicant.job_id}</p>
                                <p><strong>Applied on:</strong> {new Date(applicant.apply_date).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {getStatusLabel(applicant.status_id)}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ViewAppliedApplicants;
