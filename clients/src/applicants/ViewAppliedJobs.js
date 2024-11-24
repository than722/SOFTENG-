import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAppliedJobs.css"; // Ensure you have a CSS file for styling

const ViewAppliedJobs = ({ employeeID }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8081/api/applied-jobs/${employeeID}`);
        setAppliedJobs(response.data);
      } catch (err) {
        setError("Failed to load applied jobs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [employeeID]);

  if (loading) {
    return <p>Loading applied jobs...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="applied-jobs-container">
      <h2>Jobs You've Applied For</h2>
      {appliedJobs.length === 0 ? (
        <p>No jobs applied yet.</p>
      ) : (
        <table className="applied-jobs-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Company Name</th>
              <th>Application Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appliedJobs.map((job) => (
              <tr key={job.applicationID}>
                <td>{job.jobTitle}</td>
                <td>{job.companyName}</td>
                <td>{new Date(job.applicationDate).toLocaleDateString()}</td>
                <td>{job.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAppliedJobs;
