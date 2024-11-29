import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewJobPosting.css';
import JobDetailView from './JobDetailView';
import EmployerJobDetailView from './EmployerJobDetailView';
import HeaderEmployer from '../Header/HeaderEmployer';
import HeaderEmployee from '../Header/HeaderEmployee';

function ViewJobPosting() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(null);

    // Get user role and ID
    const userType = localStorage.getItem('userType'); // e.g., "employer" or "employee"
    const userId = localStorage.getItem('userId'); // User ID

    // Sign out function
    const handleSignOut = () => {
        localStorage.clear(); // Clear user data
        window.location.href = '/login'; // Redirect to login page
    };

    useEffect(() => {
        // Fetch all job postings
        axios.get('http://localhost:8081/api/job_postings')
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
        fetchJobDetails(job.job_id);
    };

    const fetchJobDetails = (job_id) => {
        setDetailsLoading(true);
        axios.get(`http://localhost:8081/api/job_postings/${job_id}`)
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

    if (loading) return <div>Loading job postings...</div>;
    if (error) return <div>{error}</div>;

    if (selectedJob && jobDetails) {
        // Render based on user role
        if (userType === 'employee') {
            return (
                <>
                    <HeaderEmployee userId={userId} onSignOut={handleSignOut} />
                    <JobDetailView 
                        jobDetails={jobDetails} 
                        onBack={handleBack} 
                        detailsLoading={detailsLoading} 
                        detailsError={detailsError} 
                    />
                </>
            );
        } else if (userType === 'employer') {
            return (
                <>
                    <HeaderEmployer userId={userId} onSignOut={handleSignOut} />
                    <EmployerJobDetailView 
                        jobDetails={jobDetails} 
                        onBack={handleBack} 
                        detailsLoading={detailsLoading} 
                        detailsError={detailsError} 
                    />
                </>
            );
        } else {
            return <div>Unauthorized user role</div>;
        }
    }

    return (
        <>
            {/* Dynamically render the header */}
            {userType === 'employer' ? (
                <HeaderEmployer userId={userId} onSignOut={handleSignOut} />
            ) : (
                <HeaderEmployee userId={userId} onSignOut={handleSignOut} />
            )}

            <div className="view-job-posting">
                <h2>Job Postings</h2>
                <ul>
                    {jobs.map(job => (
                        <li key={job.job_id} onClick={() => handleJobClick(job)} className="job-card">
                            <div className="job-metadata">
                                <h3>{job.jobName || "Job Title Not Available"}</h3>
                                <span>{job.typeOfWork || 'Full Time'}</span>
                            </div>
                            <p className="job-description">{job.description}</p>
                            <p className="job-salary">Salary: ${job.salary}</p>
                            <p className="job-country">Country: {job.country}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default ViewJobPosting;
