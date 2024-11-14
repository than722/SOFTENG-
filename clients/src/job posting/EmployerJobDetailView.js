import React from 'react';
import './EmployerJobDetailView.css';
import axios from 'axios';

function EmployerJobDetailView({ jobDetails, onBack, detailsLoading, detailsError, onEdit, onDelete }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
            const employerId = localStorage.getItem('userId'); // Get employer ID from localStorage
            if (!employerId) {
                alert('User not logged in');
                return;
            }
            const response = await axios.delete(`/api/jobs/${jobDetails.job_id}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Send the token for authentication
                }
            });

            if (response.status === 200) {
                alert('Job posting successfully deleted!');
                onDelete(jobDetails.job_id); // Trigger the delete callback
            } else {
                alert('There was an issue with deleting the job posting.');
            }
        } catch (error) {
            console.error('Failed to delete the job:', error);
            alert('There was an error while trying to delete the job. Please try again later.');
        }
    };

    if (detailsLoading) return <div>Loading job details...</div>;
    if (detailsError) return <div>{detailsError}</div>;

    return (
        <div className="employer-job-detail-view">
            <button onClick={onBack} className="back-button">&lt; Back to job list</button>
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
            <div className="job-actions">
                <button onClick={() => onEdit(jobDetails.job_id)} className="edit-button">Edit</button>
                <button onClick={handleDelete} className="delete-button">Delete</button>
            </div>
        </div>
    );
}

export default EmployerJobDetailView;
