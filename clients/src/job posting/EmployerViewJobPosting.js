import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewJobPosting.css'; // Reuse the existing CSS
import EmployerJobDetailView from './EmployerJobDetailView';
import HeaderEmployer from '../Header/HeaderEmployer';

function EmployerViewJobPosting() {
    const [allJobs, setAllJobs] = useState([]);
    const [employerJobs, setEmployerJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [tab, setTab] = useState('all'); // 'all' or 'employer'
    const userId = localStorage.getItem('userId');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const [allJobsRes, employerJobsRes] = await Promise.all([
                    axios.get('http://localhost:8081/api/job_postings'),
                    axios.get(`http://localhost:8081/api/employers/${userId}/jobs`),
                ]);

                setAllJobs(allJobsRes.data);
                setEmployerJobs(employerJobsRes.data);
                setFilteredJobs(allJobsRes.data); // Default to showing all jobs
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to fetch job postings');
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [userId]);

    const handleTabChange = (newTab) => {
        setTab(newTab);
        setFilteredJobs(newTab === 'all' ? allJobs : employerJobs);
    };

    const handleSearch = () => {
        const filtered = (tab === 'all' ? allJobs : employerJobs).filter((job) =>
            job.jobName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredJobs(filtered);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleJobClick = (job) => {
        setSelectedJob(job);
    };

    const handleBack = () => {
        setSelectedJob(null);
    };

    if (loading) return <div>Loading job postings...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <HeaderEmployer userId={userId} onSignOut={() => localStorage.clear()} />
            <div className="view-job-posting">
                <h2>Job Postings</h2>
                <div className="evjp-tabs">
                    <button
                        className={tab === 'all' ? 'active' : ''}
                        onClick={() => handleTabChange('all')}
                    >
                        All Job Postings
                    </button>
                    <button
                        className={tab === 'employer' ? 'active' : ''}
                        onClick={() => handleTabChange('employer')}
                    >
                        My Job Postings
                    </button>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Search for a job or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="search-button" onClick={handleSearch}>
                        Search
                    </button>
                </div>

                {!selectedJob ? (
                    <div className="job-listing">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => (
                                <div
                                    key={job.job_id}
                                    onClick={() => handleJobClick(job)}
                                    className="job-card"
                                    style={{ width: 'calc(50% - 10px)' }}
                                >
                                    <div className="job-metadata">
                                        <h3>{job.jobName || 'Job Title Not Available'}</h3>
                                        <span>{job.contractYears || '2 Years'}</span>
                                    </div>
                                    <p className="job-description">{job.jobDescription}</p>
                                    <p className="job-salary">Salary: ${job.salary}</p>
                                    <p className="job-country">Country: {job.country}</p>
                                </div>
                            ))
                        ) : (
                            <p>No matching job postings found</p>
                        )}
                    </div>
                ) : (
                    <EmployerJobDetailView
                        jobDetails={selectedJob}
                        onBack={handleBack}
                        detailsLoading={loading}
                        detailsError={error}
                    />
                )}
            </div>
        </>
    );
}

export default EmployerViewJobPosting;
