import React, { useState, useEffect } from "react";
import "../components/Body.css";
import WorkPermitDate from "../components/WorkPermitDate";
import WorkPermitDateExp from "../components/WorkPermitDateExp";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const Upload = () => {
  const steps = 5;
  const activeStep = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [idFile, setIdFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);
  const [permitFile, setPermitFile] = useState(null);

  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) navigate("/contact");
  }, [userId, navigate]);

  const uploadFile = async (file, endpoint) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/api/upload/${endpoint}/${userId}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || `Failed to upload to ${endpoint}`);
    }
    return res.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Upload ID document (required)
      if (!idFile) throw new Error("ID document is required");
      await uploadFile(idFile, "id-document");

      // Upload proof of address (required)
      if (!addressFile) throw new Error("Proof of address is required");
      await uploadFile(addressFile, "proof-of-address");

      // Upload work permit (optional)
      if (permitFile) {
        await uploadFile(permitFile, "work-permit");
      }

      // Save work permit dates
      const res = await fetch(`${API_BASE}/api/users/${userId}/work-permit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permit_document_path: permitFile ? "uploaded" : "pending",
          issue_date: issueDate || new Date().toISOString().slice(0, 10),
          expiry_date: expiryDate || new Date().toISOString().slice(0, 10),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save work permit");
      }

      navigate("/thank");
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const FileInput = ({ label, note, onChange, file, required }) => (
    <div className="mb-3">
      <h6>
        {label} {required && <span style={{ color: "red" }}>*</span>}
        {note && <><br /><small>{note}</small></>}
      </h6>
      <div
        style={{
          width: "300px",
          border: `2px dashed ${file ? "#28a745" : "#211aee"}`,
          borderRadius: "10px",
          padding: "12px",
          backgroundColor: file ? "#f0fff4" : "#F5F5F5",
          cursor: "pointer",
          textAlign: "center",
        }}
        onClick={() => document.getElementById(`file-${label}`).click()}
      >
        <input
          id={`file-${label}`}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          style={{ display: "none" }}
          onChange={(e) => onChange(e.target.files[0])}
        />
        {file ? (
          <span style={{ color: "#28a745" }}>
            <i className="bi bi-check-circle me-2"></i>{file.name}
          </span>
        ) : (
          <span style={{ color: "#666" }}>
            <i className="bi bi-upload me-2"></i>Click to upload
          </span>
        )}
      </div>
    </div>
  );

  return (
    <main className="py-5">
      <div className="centered-content text-center mb-4">
        <h1 style={{ color: "#2B26ED" }}>Self Sign-up</h1>

        <div className="stepper-wrapper mt-3">
          <div className="stepper">
            {Array.from({ length: steps }).map((_, index) =>
              index + 1 === activeStep ? (
                <div key={index} className="active-step">{index + 1}</div>
              ) : (
                <i key={index} className="bi bi-circle-fill step"></i>
              )
            )}
          </div>
        </div>
      </div>

      <div className="container text-start">
        <div className="row">
          <div className="col-md-4">
            <h4><b>Upload Your Documents</b></h4>

            {error && <div className="text-danger mb-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <FileInput
                label="ID Document"
                note="(jpg, jpeg, png, pdf)"
                file={idFile}
                onChange={setIdFile}
                required
              />

              <FileInput
                label="Proof of Address"
                note="(jpg, jpeg, png, pdf)"
                file={addressFile}
                onChange={setAddressFile}
                required
              />

              <FileInput
                label="Work Permit"
                note="Optional (jpg, jpeg, png, pdf)"
                file={permitFile}
                onChange={setPermitFile}
                required={false}
              />

              <WorkPermitDate value={issueDate} onChange={setIssueDate} />
              <WorkPermitDateExp value={expiryDate} onChange={setExpiryDate} />

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn fw-bold px-4 py-2"
                  disabled={loading}
                  style={{
                    backgroundColor: "#e8ff67",
                    color: "#2a2ac4",
                    borderRadius: "50px",
                    border: "2px solid #211aee",
                    fontSize: "1rem",
                  }}
                >
                  {loading ? "Uploading..." : "Submit"}
                  <i className="bi bi-arrow-right-circle ms-2"></i>
                </button>
              </div>
            </form>
          </div>

          <div className="col-md-6 d-flex justify-content-end">
            <img src="/card.png" alt="Card" style={{ width: "627px", height: "391px" }} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Upload;