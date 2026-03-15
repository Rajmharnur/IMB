import React, { useState, useEffect } from "react";
import "../components/Body.css";
import DobInput from "../components/DobInput";
import IdInput from "../components/IdInput";
import CountryInput from "../components/CountryInput";
import GenderDropdown from "../components/GenderDropdown";
import IdTypeDropdown from "../components/IdTypeDropdown";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const Tell = () => {
  const steps = 5;
  const activeStep = 2;
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber = location.state?.mobileNumber;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    idType: "",
    idNumber: "",
    country: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mobileNumber) navigate("/apply");
  }, [mobileNumber, navigate]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    console.log("Form data:", form);
    if (
      !form.firstName || !form.lastName || !form.dob || !form.gender ||
      !form.idType || !form.idNumber || !form.country ||
      !form.username || !form.password || !form.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const dobDate = form.dob.includes("T") ? form.dob : form.dob ? `${form.dob}T00:00:00` : null;
      const createRes = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          dob: dobDate || new Date().toISOString().slice(0, 10),
          mobile_number: mobileNumber,
          employer: "Pending",
          username: form.username,
          password: form.password,
        }),
      });

      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        throw new Error(createData?.error || createData?.message || "Failed to create user");
      }

      const userId = createData.id;
      if (!userId) throw new Error("User created but no id returned");
      
      const idRes = await fetch(`${API_BASE}/api/users/${userId}/identification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_type: form.idType,
          id_number: form.idNumber,
          country_of_issue: form.country,
          id_document_path: "pending",
        }),
      });

      if (!idRes.ok) {
        const data = await idRes.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save identification");
      }

      navigate("/where", { state: { userId } });
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
            <h4><b>Tell Us About You</b></h4>

            {error && <div className="text-danger mb-2">{error}</div>}

            <h6>First name</h6>
            <input
              type="text"
              className="form-control"
              style={{ width: "300px", backgroundColor: "#F5F5F5" }}
              placeholder="Lorem ipsum"
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
            />

            <h6 className="mt-2">Last name</h6>
            <input
              type="text"
              className="form-control"
              style={{ width: "300px", backgroundColor: "#F5F5F5" }}
              placeholder="Lorem ipsum"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
            />

            <DobInput
              value={form.dob}
              onChange={(v) => updateField("dob", v)}
            />

            <GenderDropdown
              value={form.gender}
              onChange={(v) => updateField("gender", v)}
            />

            <IdTypeDropdown
              value={form.idType}
              onChange={(v) => updateField("idType", v)}
            />

            <IdInput
              value={form.idNumber}
              onChange={(v) => updateField("idNumber", v)}
            />

            <CountryInput
              value={form.country}
              onChange={(v) => updateField("country", v)}
            />

            {/* Username */}
            <h6 className="mt-2">Username</h6>
            <input
              type="text"
              className="form-control"
              style={{ width: "300px", backgroundColor: "#F5F5F5" }}
              placeholder="Choose a username"
              value={form.username}
              onChange={(e) => updateField("username", e.target.value)}
            />

            {/* Password */}
            <h6 className="mt-2">Password</h6>
            <div style={{ position: "relative", width: "300px" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                style={{ backgroundColor: "#F5F5F5", paddingRight: "2.5rem", MsReveal: "none" }}
                placeholder="Choose a password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
              />
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                onClick={() => setShowPassword((prev) => !prev)}
                style={{
                  position: "absolute", right: "10px", top: "50%",
                  transform: "translateY(-50%)", cursor: "pointer", color: "#666",
                }}
              />
            </div>

            {/* Confirm Password */}
            <h6 className="mt-2">Confirm Password</h6>
            <div style={{ position: "relative", width: "300px" }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                style={{ backgroundColor: "#F5F5F5", paddingRight: "2.5rem", MsReveal: "none" }}
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
              />
            </div>

            <div className="mt-4">
              <button
                className="btn fw-bold px-4 py-2"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  backgroundColor: "#e8ff67",
                  color: "#2a2ac4",
                  borderRadius: "50px",
                  border: "2px solid #211aee",
                }}
              >
                {loading ? "Submitting..." : "Next"}
                <i className="bi bi-arrow-right-circle ms-2"></i>
              </button>
            </div>
          </div>

          <div className="col-md-6 d-flex justify-content-end">
            <img src="/card.png" alt="Card" style={{ width: "627px" }} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Tell;