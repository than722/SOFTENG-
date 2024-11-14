import React, { useEffect } from 'react';
import './JobDetailView.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JobDetailView({ jobDetails, onBack, detailsLoading, detailsError }) {
    const navigate = useNavigate();

    useEffect(() => {
        // Verify session by calling the backend
        axios
            .get('http://localhost:8081/verify-session', { withCredentials: true }) // Include cookies in the request
            .then((res) => {
                if (res.status !== 200 || res.data.userType !== 'employee') {
                    alert('Access denied: This page is only accessible to employees.');
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

    const handleApply = async () => {
        try {
            // Make an API request to apply for a job
            const response = await axios.post(
                'http://localhost:8081/api/applications/apply',
                { job_id: jobDetails?.job_id }, // Only job_id is required, employee_id is derived from the token
                { withCredentials: true } // Include credentials (cookies)
            );

            if (response.status === 201) {
                alert('Application successfully sent!');
            } else {
                alert('There was an issue with your application.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please log in again.');
                navigate('/login');
            } else {
                console.error('Failed to apply to the job:', error);
                alert('There was an error while trying to apply. Please try again later.');
            }
        }
    };

    if (detailsLoading) return <div>Loading job details...</div>;
    if (detailsError) return <div>{detailsError}</div>;

    return (
        <div className="job-detail-view">
            <button onClick={onBack} className="back-button">&lt; Back to search results</button>
            <h2>{jobDetails?.jobName || 'Job Name Not Available'}</h2>
            <div className="job-metadata">
                <div>
                    <h4>Type of Work</h4>
                    <p>{jobDetails?.typeOfWork || 'Full Time'}</p>
                </div>
                <div>
                    <h4>Salary</h4>
                    <p>${jobDetails?.salary || 'Not Disclosed'}</p>
                </div>
                <div>
                    <h4>Date Posted</h4>
                    <p>{formatDate(jobDetails?.datePosted)}</p>
                </div>
            </div>
            <div className="job-overview">
                <h3>Job Overview</h3>
                <p>{jobDetails?.jobOverview || 'No overview available.'}</p>
            </div>
            <button onClick={handleApply} className="apply-button">Apply</button>
        </div>
    );
}

export default JobDetailView;
