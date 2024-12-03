import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Deficiencies.css';

function Deficiencies() {
    const [applicants, setApplicants] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [requiredFiles, setRequiredFiles] = useState([]);
    const [availableFiles, setAvailableFiles] = useState([
        'resume',
        'Valid ID',
        'birth_certificate',
        'picture',
        'passport',
        'marriage_contract',
    ]); // Files admin can request

    useEffect(() => {
        // Fetch all applicants
        axios.get('http://localhost:8081/api/applicants').then((res) => {
            setApplicants(res.data);
        });
    }, []);

    const handleSendRequest = () => {
        if (!selectedApplicant || requiredFiles.length === 0) {
            alert('Please select an applicant and at least one required file.');
            return;
        }

        axios
            .post('http://localhost:8081/api/deficiencies/request', {
                applicantId: selectedApplicant,
                requiredFiles,
            })
            .then((res) => {
                alert('Deficiency request sent successfully.');
                setRequiredFiles([]); // Clear selection
            })
            .catch((err) => {
                console.error('Error sending deficiency request:', err);
                alert('Failed to send deficiency request.');
            });
    };

    return (
        <div className="deficiencies">
            <h2>Manage Deficiencies</h2>

            {/* Select Applicant */}
            <div className="applicant-selection">
                <h4>Select Applicant</h4>
                <select
                    value={selectedApplicant || ''}
                    onChange={(e) => setSelectedApplicant(e.target.value)}
                >
                    <option value="" disabled>
                        Select an applicant
                    </option>
                    {applicants.map((applicant) => (
                        <option key={applicant.id} value={applicant.id}>
                            {applicant.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Select Required Files */}
            <div className="file-selection">
                <h4>Select Required Files</h4>
                {availableFiles.map((file, index) => (
                    <div key={index} className="file-checkbox">
                        <input
                            type="checkbox"
                            id={`file-${index}`}
                            value={file}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setRequiredFiles([...requiredFiles, file]);
                                } else {
                                    setRequiredFiles(requiredFiles.filter((f) => f !== file));
                                }
                            }}
                        />
                        <label htmlFor={`file-${index}`}>{file}</label>
                    </div>
                ))}
            </div>

            {/* Send Request Button */}
            <button onClick={handleSendRequest} className="send-request-button">
                Send Request
            </button>
        </div>
    );
}

export default Deficiencies;
