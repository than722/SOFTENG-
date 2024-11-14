import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewJobPosting.css';
import JobDetailView from './JobDetailView';

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
        axios.get('http://localhost:8081/api/job_postings')
            .then(response => {
                console.log(response.data); // Check job data here
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
        fetchJobDetails(job.job_id); // Updated from job.id to job.job_id
    };

    const fetchJobDetails = (job_id) => {  // Updated parameter name from id to job_id
        setDetailsLoading(true);
        axios.get(`http://localhost:8081/api/job_postings/${job_id}`)  // Updated from id to job_id
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
        return (
            <JobDetailView 
                jobDetails={jobDetails} 
                onBack={handleBack} 
                detailsLoading={detailsLoading} 
                detailsError={detailsError} 
            />
        );
    }

    return (
        <div className="view-job-posting">
            <h2>Job Postings</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job.job_id} onClick={() => handleJobClick(job)} className="job-card"> {/* Updated from job.id to job.job_id */}
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
    );
}

export default ViewJobPosting;
