import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewAppliedApplicants.css';
import EmployerP from '../EmployerP';

function ViewAppliedApplicants() {
    const { jobId } = useParams(); // Get jobId from the URL
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch applicants for the specific job posting
        axios
            .get(`http://localhost:8081/api/applications/job/${jobId}`, { withCredentials: true })
            .then((response) => {
                setApplicants(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching applicants:', error);
                setError('Failed to fetch applicants.');
                setLoading(false);
            });
    }, [jobId]);

    if (loading) return <div>Loading applicants...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="view-applied-applicants">
            <h2>Applicants for Job ID: {jobId}</h2>
            {applicants.length === 0 ? (
                <p>No one has applied for this job yet.</p>
            ) : (
                <ul className="applicants-list">
                    {applicants.map((applicant) => (
                        <li key={applicant.applicationId} className="applicant-card">
                            <div className="applicant-details">
                                <h3>{applicant.applicantName}</h3>
                                <p><strong>Email:</strong> {applicant.applicantEmail}</p>
                                <p><strong>Applied on:</strong> {new Date(applicant.appliedDate).toLocaleDateString()}</p>
                                <p><strong>Status:</strong> {applicant.status || 'Pending'}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ViewAppliedApplicants;
