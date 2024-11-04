// src/ViewJobPosting.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewJobPosting.css';
import './JobDetailView.css'; // Import the CSS for the detailed view

function ViewJobPosting() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    useEffect(() => {
        // Fetch all job postings
        axios.get('http://localhost:8081/api/job_postings') // Updated URL
            .then(response => {
                setJobs(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching job postings:', error);
                setError('Failed to fetch job postings');
                setLoading(false);
            });
    }, []);

    const handleJobClick = (job) => {
        setSelectedJob(job);
        fetchJobDetails(job.id);
    };

    const fetchJobDetails = (id) => {
        setDetailsLoading(true);
        axios.get(`http://localhost:8081/api/job_postings/${id}`) // Updated URL
            .then(response => {
                setJobDetails(response.data);
                setDetailsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching job details:', error);
                setDetailsError('Failed to fetch job details');
                setDetailsLoading(false);
            });
    };

    const handleBack = () => {
        setSelectedJob(null);
        setJobDetails(null);
        setDetailsError(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // This will give you "yyyy-mm-dd"
    };

    if (loading) return <div>Loading job postings...</div>;
    if (error) return <div>{error}</div>;

    if (selectedJob && jobDetails) {
        if (detailsLoading) return <div>Loading job details...</div>;
        if (detailsError) return <div>{detailsError}</div>;

        return (
            <div className="job-detail-view">
                <button onClick={handleBack} className="back-button">&lt; Back to search results</button>
                <h2>{jobDetails.name}</h2>
                <div className="login-prompt">
                    Please <a href="/login">login</a> or <a href="/register">register</a> as a jobseeker to apply for this job.
                </div>
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
            </div>
        );
    }

    return (
        <div className="view-job-posting">
            <h2>Job Postings</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job.id} onClick={() => handleJobClick(job)} className="job-card">
                        <div className="job-metadata">
                            <h3>{job.name}</h3>
                            <span>{job.typeOfWork || 'Full Time'}</span>
                        </div>
                        <p className="job-description">{job.description}</p>
                        <p className="job-salary">Salary: ${job.salary}</p>
                        <p className="job-country">Country: {job.country}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewJobPosting;
