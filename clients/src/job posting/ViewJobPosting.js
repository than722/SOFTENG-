import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewJobPosting.css';
import JobDetailView from './JobDetailView';
import EmployerJobDetailView from './EmployerJobDetailView';
import HeaderEmployer from '../Header/HeaderEmployer';
import HeaderEmployee from '../Header/HeaderEmployee';

function ViewJobPosting() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]); // Filtered jobs to display after search
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobDetails, setJobDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State for search term

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
                setFilteredJobs(response.data); // Initially, show all jobs
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

    // Handle Search
    const handleSearch = () => {
        const filtered = jobs.filter(job =>
            job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJobs(filtered);
    };

    // Handle Enter key press for search
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
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

                {/* Search Bar */}
                <div className="search-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search for a job or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress} // Listen for "Enter" key press
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>

                {/* Job Listings (Filtered or All) */}
                <div className="job-listing">
                    {filteredJobs.length > 0 ? (
                        filteredJobs.map((job, index) => (
                            <div
                                key={job.job_id}
                                onClick={() => handleJobClick(job)}
                                className="job-card"
                                style={{ width: 'calc(50% - 10px)' }} // 2 cards per row
                            >
                                <div className="job-metadata">
                                    <h3>{job.jobName || "Job Title Not Available"}</h3>
                                    <span>{job.typeOfWork || 'Full Time'}</span>
                                </div>
                                <p className="job-description">{job.description}</p>
                                <p className="job-salary">Salary: ${job.salary}</p>
                                <p className="job-country">Country: {job.country}</p>
                            </div>
                        ))
                    ) : (
                        <p>No matching job postings found</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default ViewJobPosting;
