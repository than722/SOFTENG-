// src/ViewJobPosting.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewJobPosting.css';

function ViewJobPosting() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch job postings from the backend
        axios.get('http://localhost:8081/api/job-postings')
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

    if (loading) return <div>Loading job postings...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="view-job-posting">
            <h2>Job Postings</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job.id}>
                        <h3>{job.name}</h3>
                        <p>{job.description}</p>
                        <p>Salary: ${job.salary}</p>
                        <p>Country: {job.country}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewJobPosting;
