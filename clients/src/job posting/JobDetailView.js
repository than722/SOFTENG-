import React from 'react';
import './JobDetailView.css';
import axios from 'axios';

function JobDetailView({ jobDetails, onBack, detailsLoading, detailsError }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
            const userId = localStorage.getItem('userId'); // Get user ID from localStorage
            if (!userId) {
                alert('User not logged in');
                return;
            }
            const response = await axios.post('/api/apply', {
                jobId: jobDetails.job_id, // Updated from jobDetails.id to jobDetails.job_id
                userId: userId // Send userId along with jobId
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Send the token for authentication
                }
            });

            if (response.status === 200) {
                alert('Application successfully sent!');
            } else {
                alert('There was an issue with your application.');
            }
        } catch (error) {
            console.error('Failed to apply to the job:', error);
            alert('There was an error while trying to apply. Please try again later.');
        }
    };

    if (detailsLoading) return <div>Loading job details...</div>;
    if (detailsError) return <div>{detailsError}</div>;

    return (
        <div className="job-detail-view">
            <button onClick={onBack} className="back-button">&lt; Back to search results</button>
            <h2>{jobDetails.jobName}</h2>
            <div className="job-metadata">
                <div>
                    <h4>Type of Work</h4>
                    <p>{jobDetails.typeOfWork || 'Full Time'}</p>
                </div>
                <div>
                    <h4>Salary</h4>
                    <p>${jobDetails.salary}</p>
                </div>
                <div>
                    <h4>Date Posted</h4>
                    <p>{formatDate(jobDetails.datePosted)}</p>
                </div>
            </div>
            <div className="job-overview">
                <h3>Job Overview</h3>
                <p>{jobDetails.jobOverview}</p>
            </div>
            <button onClick={handleApply} className="apply-button">Apply</button>
        </div>
    );
}

export default JobDetailView;
