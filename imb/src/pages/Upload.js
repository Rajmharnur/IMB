import React, { useState, useEffect } from "react";
import "../components/Body.css";
import FileUploadButton from "../components/FileUploadButton";
import FileUploadButton1 from "../components/FileUploadButton1";
import FileUploadButton2 from "../components/FileUploadButton2";
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

  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) navigate("/contact");
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/work-permit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          permit_document_path: "pending",
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

  return (
    <main className="py-5">
      <div className="centered-content text-center mb-4">
        <h1 style={{ color: "#2B26ED" }}>Self Sign-up</h1>

        <div className="stepper-wrapper mt-3">
          <div className="stepper">
            {Array.from({ length: steps }).map((_, index) =>
              index + 1 === activeStep ? (
                <div key={index} className="active-step">
                  {index + 1}
                </div>
              ) : (
                <i key={index} className="bi bi-circle-fill step"></i>
              )
            )}
          </div>
        </div>
      </div>

      <div className="container text-start">
        <div className="row">
          {/* LEFT COLUMN */}
          <div className="col-md-4">
            <h4><b>Upload Your Documents</b></h4>

            {error && <div className="text-danger mb-2">{error}</div>}

            {/* ✅ FORM START */}
            <form onSubmit={handleSubmit}>
              <h6>
                Upload good quality picture of your ID <br />
                <small>(jpg, jpeg, png)</small>
              </h6>
              <FileUploadButton />

              <h6 className="mt-3">Upload Proof of Address</h6>
              <FileUploadButton1 />

              <h6 className="mt-3">
                Upload good quality picture of your work permit (optional)
              </h6>
              <FileUploadButton2 />

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
                  {loading ? "Submitting..." : "Submit"}
                  <i className="bi bi-arrow-right-circle ms-2"></i>
                </button>
              </div>
            </form>
            {/* ✅ FORM END */}
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-6 d-flex justify-content-end">
            <img
              src="/card.png"
              alt="Card"
              style={{ width: "627px", height: "391px" }}
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Upload;
