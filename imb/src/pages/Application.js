import React, { useState } from "react";
import "../components/Body.css";
import "./Application.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const Application = () => {
  const steps = 5;
  const activeStep = 1;
  const navigate = useNavigate();

  const [mobileNumber, setMobileNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // User types 9 digits after +27, we prepend 0 to make 0XXXXXXXXX
  const normalizeMobileLocal = (input) => {
    if (!input) return "";
    const digits = input.replace(/\D/g, "");
    return "0" + digits;
  };

  // South African mobile validation (local format starting with 0)
  const validateMobile = (number) => {
    const saMobileRegex = /^0[6-8][0-9]{8}$/;
    return saMobileRegex.test(number);
  };

  const handleSendOtp = async () => {
    const normalized = normalizeMobileLocal(mobileNumber);

    if (!mobileNumber) {
      setError("Mobile number is required");
      return;
    }

    if (!validateMobile(normalized)) {
      setError("Enter a valid South African mobile number");
      return;
    }

    setError("");
    setLoading(true);
    console.log("Normalized:", normalized);
    try {
      const response = await fetch(`${API_URL}/api/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: normalized,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Failed to send OTP");
      }

      navigate("/otp", { state: { mobileNumber: normalized } });
    } catch (err) {
      console.error(err);
      setError(err.message);
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
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container text-start">
        <div className="row">
          {/* Left column */}
          <div className="col-md-4">
            <h4><b>Verify Your Mobile Number</b></h4>
            <h6>Enter your mobile number</h6>

            {/* Input with +27 prefix */}
            <div style={{ position: "relative", width: "300px" }}>
              <span
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#555",
                  fontWeight: "bold",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              >
                +27
              </span>
              <input
                type="tel"
                className="form-control"
                placeholder="821234567"
                value={mobileNumber}
                maxLength={9}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                style={{
                  backgroundColor: "#F5F5F5",
                  paddingLeft: "48px",
                }}
              />
            </div>

            {error && <small style={{ color: "red" }}>{error}</small>}

            <h6 className="mt-2">
              We'll send you a One-Time PIN (OTP) via SMS to verify your number.
            </h6>

            <div className="mt-4">
              <button
                className="btn fw-bold px-4 py-2"
                onClick={handleSendOtp}
                disabled={loading}
                style={{
                  backgroundColor: "#e8ff67",
                  color: "#2a2ac4",
                  borderRadius: "50px",
                  border: "2px solid #211aee",
                }}
              >
                {loading ? "Sending..." : "Send OTP"}
                <i className="bi bi-arrow-right-circle ms-2"></i>
              </button>
            </div>
          </div>

          {/* Right column */}
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

export default Application;