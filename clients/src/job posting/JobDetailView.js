import React, { useEffect, useState } from 'react';
import './JobDetailView.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function JobDetailView({ jobDetails, onBack, detailsLoading, detailsError }) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false); // Track if the employee is accepted

    useEffect(() => {
        axios
            .get('http://localhost:8081/verify-session', { withCredentials: true })
            .then((res) => {
                if (res.status !== 200 || res.data.userType !== 'employee') {
                    alert('Access denied: This page is only accessible to employees.');
                    navigate('/');
                }
                // Check if the employee is approved by the admin
                setIsAccepted(res.data.isAccepted); // Backend should return `isAccepted`
            })
            .catch(() => {
                alert('You must be logged in to view this page.');
                navigate('/login');
            });

        if (jobDetails?.job_id) {
            axios
                .get(`http://localhost:8081/api/applications/check/${jobDetails.job_id}`, { withCredentials: true })
                .then((res) => {
                    if (res.data.applied) {
                        setHasApplied(true);
                    }
                })
                .catch((err) => {
                    console.error('Error checking application status:', err);
                });
        }
    }, [navigate, jobDetails]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    const handleApply = async () => {
        if (isSubmitting || hasApplied) return;
        setIsSubmitting(true);
        try {
            const response = await axios.post(
                'http://localhost:8081/api/applications/apply',
                { job_id: jobDetails?.job_id }, // Only send job_id
                { job_id: jobDetails?.job_id },
                { withCredentials: true }
            );

            if (response.status === 201) {
                alert('Application successfully sent!');
                setHasApplied(true); // Mark as applied
                setHasApplied(true);
            } else {
                alert('There was an issue with your application.');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please log in again.');
                navigate('/login');
            } else {
                alert('There was an error while trying to apply. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (detailsLoading) return <div>Loading job details...</div>;
    if (detailsError) return <div>{detailsError}</div>;

    return (
        <div className="job-detail-view">
            <button onClick={onBack} className="back-button">&lt; Back to job list</button>
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
            <div className='space'>
                <div className="job-overview">
                    <h3>Job Overview</h3>
                    <h6 className="overviewp">{jobDetails.jobOverview}</h6>
                </div>
                <button
                    onClick={handleApply}
                    className={`apply-button ${hasApplied ? 'applied-button' : ''}`}
                    disabled={isSubmitting || hasApplied}>
                    {hasApplied ? 'Applied' : isSubmitting ? 'Applying...' : 'Apply'}
                </button>
            </div>
            {/* Render the apply button only if the user is accepted */}
            {isAccepted && !hasApplied && (
                <button 
                    onClick={handleApply} 
                    className={`apply-button ${hasApplied ? 'applied-button' : ''}`} 
                    disabled={isSubmitting || hasApplied}>
                    {hasApplied ? 'Applied' : isSubmitting ? 'Applying...' : 'Apply'}
                </button>
            )}
            {!isAccepted && (
                <p className="not-accepted-message">Your account is pending approval by the admin.</p>
            )}
        </div>
    );
}

export default JobDetailView;
