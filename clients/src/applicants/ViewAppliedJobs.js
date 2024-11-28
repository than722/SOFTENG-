import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAppliedJobs.css"; // Ensure you have a CSS file for styling

const ViewAppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const employeeID = localStorage.getItem("userId"); // Retrieve employee ID from local storage
        if (!employeeID) {
          throw new Error("User ID not found in local storage");
        }
        const response = await axios.get(`http://localhost:8081/api/applied-jobs/${employeeID}`);
        setAppliedJobs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applied jobs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, []);

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
        <p>No jobs applied yet.</p> // This message will now show when the backend returns an empty array
      ) : (
        <table className="applied-jobs-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Job Overview</th>
              <th>Job Description</th>
              <th>Salary</th>
              <th>Country</th>
              <th>Company Name</th>
            </tr>
          </thead>
          <tbody>
            {appliedJobs.map((job) => (
              <tr key={job.job_id}>
                <td>{job.jobName}</td>
                <td>{job.jobOverview}</td>
                <td>{job.jobDescription}</td>
                <td>{job.salary}</td>
                <td>{job.country}</td>
                <td>{job.companyName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAppliedJobs;
