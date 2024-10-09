import React, { useState } from 'react';
import './AddJobPosting.css';

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
        const jobData = {
            jobName,
            jobDescription,
            jobOverview,
            salary,
            country,
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
                const data = await response.json();
                setSuccessMessage('Job posting created successfully.');
                console.log('Job Data Submitted: ', data);
                setJobName('');
                setJobDescription('');
                setJobOverview('');
                setSalary('');
                setCountry('');
            } else {
                const errorData = await response.json();
                setErrorMessage(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error submitting job data:', error);
            setErrorMessage('An error occurred while submitting the job posting.');
        }
    };

    return (
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
    );
}

export default AddJobPosting;
