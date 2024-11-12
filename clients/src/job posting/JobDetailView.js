import React from 'react';
import './JobDetailView.css';

function JobDetailView({ jobDetails, onBack, detailsLoading, detailsError }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    };

    if (detailsLoading) return <div>Loading job details...</div>;
    if (detailsError) return <div>{detailsError}</div>;

    return (
        <div className="job-detail-view">
            <button onClick={onBack} className="back-button">&lt; Back to search results</button>
            <h2>{jobDetails.jobName}</h2>
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

export default JobDetailView;