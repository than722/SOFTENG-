import React, { useState } from 'react';
import './AddJobPosting.css';

function AddJobPosting() {
    const [jobName, setJobName] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [salary, setSalary] = useState('');
    const [country, setCountry] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const jobData = {
            jobName,
            jobDescription,
            salary,
            country,
        };
        console.log('Job Data Submitted: ', jobData);
        setJobName('');
        setJobDescription('');
        setSalary('');
        setCountry('');
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
        </div>
    );
}

export default AddJobPosting;
