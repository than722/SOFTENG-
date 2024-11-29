import React, { useState } from 'react';
import './AddJobPosting.css';
import HeaderEmployer from '../Header/HeaderEmployer';

function AddJobPosting() {
    const [jobName, setJobName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobOverview, setJobOverview] = useState('');
    const [salary, setSalary] = useState('');
    const [country, setCountry] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');

        if (!userId) {
            setErrorMessage('User not authenticated.');
            return;
        }

        const jobData = {
            jobName,
            jobDescription,
            jobOverview,
            salary,
            country,
            employer_id: userId,
        };

        try {
            const response = await fetch('http://localhost:8081/api/job_postings/AddJobPosting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                setJobName('');
                setJobDescription('');
                setJobOverview('');
                setSalary('');
                setCountry('');
                setSuccessMessage('Job posting created successfully.');
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setErrorMessage('An error occurred while submitting the job posting.');
        }
    };

    return (
        <>
            <HeaderEmployer 
                userId={localStorage.getItem('userId')} 
                auth={true} 
                onSignOut={() => {
                    localStorage.clear();
                    window.location.href = '/';
                }} 
            />
            <div className="main-content"> {/* Add a wrapper for page content */}
                <div className="add-job-posting">
                    <h2>Add Job Posting</h2>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>Job Name:</label>
                            <input
                                type="text"
                                value={jobName}
                                onChange={(e) => setJobName(e.target.value)}
                                placeholder="Enter job name"
                                required
                            />
                        </div>
                        <div>
                            <label>Job Description:</label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Enter job description"
                                required
                            />
                        </div>
                        <div>
                            <label>Job Overview:</label>
                            <textarea
                                value={jobOverview}
                                onChange={(e) => setJobOverview(e.target.value)}
                                placeholder="Enter job overview"
                                required
                            />
                        </div>
                        <div>
                            <label>Salary:</label>
                            <input
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                placeholder="Enter salary"
                                required
                            />
                        </div>
                        <div>
                            <label>Country:</label>
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                placeholder="Enter country"
                                required
                            />
                        </div>
                        <button type="submit">Submit Job</button>
                    </form>
                    {errorMessage && <p className="error">{errorMessage}</p>}
                    {successMessage && <p className="success">{successMessage}</p>}
                </div>
            </div>
        </>
    );
}

export default AddJobPosting;
