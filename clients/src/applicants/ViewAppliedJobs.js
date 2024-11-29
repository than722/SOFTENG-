import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewAppliedJobs.css"; // Ensure you have a CSS file for styling
import HeaderEmployee from "../Header/HeaderEmployee";
import SignOut from "../Sign in/SignOut"; // Import your SignOut component

const ViewAppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Retrieve `userId` and `auth` from localStorage
  const userId = localStorage.getItem("userId");
  const auth = !!localStorage.getItem("authToken");

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        if (!userId) {
          throw new Error("User ID not found in local storage");
        }
        const response = await axios.get(`http://localhost:8081/api/applied-jobs/${userId}`);
        setAppliedJobs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load applied jobs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [userId]);

  if (loading) {
    return <p>Loading applied jobs...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <>
      {/* Use the HeaderEmployee component */}
      <HeaderEmployee 
        userId={userId} 
        auth={auth} 
        onSignOut={() => {
          SignOut(); // Call the SignOut function from your component
        }}
      />

      <div className="applied-jobs-container">
        <h2>Jobs You've Applied For</h2>
        {appliedJobs.length === 0 ? (
          <p>No jobs applied yet.</p> 
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
    </>
  );
};

export default ViewAppliedJobs;
