import React, { useEffect, useState } from 'react';
import './EmployerJobDetailView.css';
import axios from 'axios';

function EmployerJobDetailView({ jobDetails, onBack, detailsLoading, detailsError, onEdit, onDelete }) {
    const [isCreator, setIsCreator] = useState(false); // Track if the logged-in employer is the creator
    const [employerId, setEmployerId] = useState(null); // To store the employer_id from the applications table
    const [hasApplications, setHasApplications] = useState(false); // Track if the job has applications
    const userId = localStorage.getItem('userId'); // Get the logged-in employer's ID

    useEffect(() => {
        if (jobDetails && userId) {
            // Fetch the employer_id from the applications table using the job_id
            axios.get(`http://localhost:8081/api/applications/job/${jobDetails.job_id}`)
                .then((response) => {
                    const applications = response.data;
                    // Find the employer_id for this job posting
                    const employerForJob = applications.find(app => app.job_id === jobDetails.job_id);
                    if (employerForJob) {
                        setEmployerId(employerForJob.employer_id);
                    }

                    // Check if there are any applications for this job
                    setHasApplications(applications.length > 0);
                })
                .catch((error) => {
                    console.error('Error fetching employer ID:', error);
                    alert('There was an error fetching the job details. Please try again later.');
                });
        }
    }, [jobDetails, userId]);

    useEffect(() => {
        if (userId && employerId) {
            // Check if the logged-in employer is the creator of the job
            setIsCreator(employerId === parseInt(userId)); // Compare job's employer ID with logged-in user's ID
        }
    }, [userId, employerId]);

    // Helper function to format the date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Return the date in YYYY-MM-DD format
    };

    // Handler for the delete button click
    const handleDelete = async () => {
        if (hasApplications) {
            alert('Cannot delete job posting: job has applicants.');
            return;
        }

        try {
            const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
            if (!userId) {
                alert('User not logged in');
                return;
            }
            const response = await axios.delete(`http://localhost:8081/api/job_postings/${jobDetails.job_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Send the token for authentication
                },
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

    // Handling loading and error states
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
            
            {isCreator && ( // Show buttons only if the logged-in employer is the creator
                <div className="job-actions">
                    <button onClick={() => onEdit(jobDetails.job_id)} className="edit-button">Edit</button>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                </div>
            )}
        </div>
    );
}

export default EmployerJobDetailView;
