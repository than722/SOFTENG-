import React, { useEffect } from 'react';
import './EmployerJobDetailView.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EmployerJobDetailView({ jobDetails, onBack, detailsLoading, detailsError, onEdit, onDelete }) {
    const navigate = useNavigate();

    // Verify session on component load
    useEffect(() => {
        axios
            .get('http://localhost:8081/verify-session', { withCredentials: true }) // Include cookies in the request
            .then((res) => {
                if (res.status !== 200 || res.data.userType !== 'employer') {
                    alert('Access denied: This page is only accessible to employers.');
                    navigate('/'); // Redirect unauthorized users
                }
            })
            .catch((err) => {
                console.error('Session verification failed:', err);
                alert('You must be logged in to view this page.');
                navigate('/login'); // Redirect to login if verification fails
            });
    }, [navigate]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleDelete = async () => {
        try {
            // Delete a job posting
            const response = await axios.delete(
                `http://localhost:8081/api/jobs/${jobDetails.job_id}`,
                { withCredentials: true } // Include cookies in the request
            );

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
            <h2>{jobDetails.jobName || 'Job Name Not Available'}</h2>
            <div className="job-metadata">
                <div>
                    <h4>Type of Work</h4>
                    <p>{jobDetails.typeOfWork || 'Full Time'}</p>
                </div>
                <div>
                    <h4>Salary</h4>
                    <p>${jobDetails.salary || 'Not Disclosed'}</p>
                </div>
                <div>
                    <h4>Date Posted</h4>
                    <p>{formatDate(jobDetails.datePosted)}</p>
                </div>
            </div>
            <div className="job-overview">
                <h3>Job Overview</h3>
                <p>{jobDetails.jobOverview || 'No overview available.'}</p>
            </div>
            <div className="job-actions">
                <button onClick={() => onEdit(jobDetails.job_id)} className="edit-button">Edit</button>
                <button onClick={handleDelete} className="delete-button">Delete</button>
            </div>
        </div>
    );
}

export default EmployerJobDetailView;
