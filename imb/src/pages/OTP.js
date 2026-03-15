import React, { useState, useEffect } from "react";
import "../components/Body.css";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../config";

const OTP = () => {
  const steps = 5;
  const activeStep = 2;
  const navigate = useNavigate();
  const location = useLocation();

  const mobileNumber = location.state?.mobileNumber;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mobileNumber) {
      navigate("/");
    }
  }, [mobileNumber, navigate]);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mobileNumber,
          otp: otp,
        }),
      });

      let data = null;
      let text = null;
      try {
        text = await response.text();
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        const msg =
          (data && (data.message || data.error)) ||
          text ||
          response.statusText ||
          "Invalid OTP";
        throw new Error(msg);
      }

      // If token exists → login flow → go to dashboard
      if (data?.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        // No token → signup flow → go to tell
        navigate("/tell", { state: { mobileNumber } });
      }

    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-5">
      <div className="centered-content">
        <div className="text-center mb-4">
          <h1 style={{ color: "#2B26ED" }}>Self Sign-up</h1>

          <div className="stepper-wrapper">
            <div className="stepper">
              {Array.from({ length: steps }).map((_, index) =>
                index + 1 === activeStep ? (
                  <div key={index} className="active-step">
                    {index + 1}
                  </div>
                ) : (
                  <i key={index} className="bi bi-circle-fill step"></i>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container text-start">
        <div className="row">
          <div className="col-md-4">
            <h4><b>Enter Your OTP</b></h4>
            <h6>OTP sent to +27{mobileNumber?.slice(1)}</h6>

            <input
              type="text"
              className="form-control"
              placeholder="000000"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              style={{
                width: "300px",
                backgroundColor: "#F5F5F5",
              }}
            />

            {error && <small style={{ color: "red" }}>{error}</small>}

            <div className="mt-4">
              <button
                className="btn fw-bold px-4 py-2"
                onClick={handleVerifyOtp}
                disabled={loading}
                style={{
                  backgroundColor: "#e8ff67",
                  color: "#2a2ac4",
                  borderRadius: "50px",
                  border: "2px solid #211aee",
                }}
              >
                {loading ? "Verifying..." : "Submit"}
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

export default OTP;