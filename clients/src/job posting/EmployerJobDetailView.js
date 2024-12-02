import React, { useEffect, useState } from 'react';
import './EmployerJobDetailView.css';
import axios from 'axios';

function EmployerJobDetailView({ jobDetails, onBack, detailsLoading, detailsError, onEdit, onDelete }) {
<<<<<<< Updated upstream
    const [isCreator, setIsCreator] = useState(false); // Track if the logged-in employer is the creator
    const userId = localStorage.getItem('userId'); // Get the logged-in employer's ID

    useEffect(() => {
        if (jobDetails && userId) {
            // Check if the logged-in employer is the creator of the job
            setIsCreator(jobDetails.employerId === parseInt(userId)); // Compare job's employer ID with logged-in user's ID
        }
    }, [jobDetails, userId]);
=======
>>>>>>> Stashed changes

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleDelete = async () => {
        try {
<<<<<<< Updated upstream
            const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
            if (!userId) {
=======
            const token = localStorage.getItem('authToken'); // Token from localStorage
            const employerId = localStorage.getItem('userId'); // Employer ID from localStorage
            if (!employerId) {
>>>>>>> Stashed changes
                alert('User not logged in');
                return;
            }
            const response = await axios.delete(`/api/jobs/${jobDetails.job_id}`, {
                headers: {
<<<<<<< Updated upstream
                    Authorization: `Bearer ${token}`, // Send the token for authentication
                },
=======
                    Authorization: `Bearer ${token}` // Send token for authentication
                }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            <div className="job-overview">
                <h3>Job Overview</h3>
                <p>{jobDetails.jobOverview}</p>
            </div>
            {isCreator && ( // Show buttons only if the logged-in employer is the creator
=======
            <div className='space'>
                <div className="job-overview">
                    <h3>Job Overview</h3>
                    <h6 className="overviewp">{jobDetails.jobOverview}</h6>
                </div>
>>>>>>> Stashed changes
                <div className="job-actions">
                    <button onClick={() => onEdit(jobDetails.job_id)} className="edit-button">Edit</button>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                </div>
<<<<<<< Updated upstream
            )}
=======
            </div>
>>>>>>> Stashed changes
        </div>
    );
}

export default EmployerJobDetailView;
