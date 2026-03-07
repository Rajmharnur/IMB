import React, { useState, useEffect } from "react";
import "../components/Body.css";
import EmployerInput from "../components/EmployerInput";
import EmailInput from "../components/EmailInput";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const Contact = () => {
  const steps = 5;
  const activeStep = 4;
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [form, setForm] = useState({
    email: "",
    employer: "",
  });

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) navigate("/where");
  }, [userId, navigate]);

  const handleNext = async () => {
    if (!form.employer) {
      setError("Employer is required");
      return;
    }

    if (form.email && !validateEmail(form.email)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email || null,
          employer: form.employer,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to update details");
      }

      navigate("/upload", { state: { userId } });
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
          <div className="col-md-4">
            <h4>
              <b>Contact & Employment Details</b>
            </h4>

            {error && <div className="text-danger mb-2">{error}</div>}

            <EmailInput
              value={form.email}
              onChange={(v) => updateField("email", v)}
            />

            <EmployerInput
              value={form.employer}
              onChange={(v) => updateField("employer", v)}
            />

            <div className="mt-4">
              <button
                className="btn fw-bold px-4 py-2"
                onClick={handleNext}
                disabled={loading}
                style={{
                  backgroundColor: "#e8ff67",
                  color: "#2a2ac4",
                  borderRadius: "50px",
                  border: "2px solid #211aee",
                }}
              >
                {loading ? "Saving..." : "Next"}
                <i className="bi bi-arrow-right-circle ms-2"></i>
              </button>
            </div>
          </div>

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

export default Contact;
