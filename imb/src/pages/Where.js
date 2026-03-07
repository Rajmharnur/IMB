import React, { useState, useEffect } from "react";
import "../components/Body.css";
import StreetNameInput from "../components/StreetNameInput";
import SuburbInput from "../components/SuburbInput";
import CityInput from "../components/CityInput";
import ProvinceDropdown from "../components/ProvinceDropdown";
import PostalInput from "../components/PostalInput";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://localhost:5000";

const Where = () => {
  const steps = 5;
  const activeStep = 3;
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  const [form, setForm] = useState({
    streetName: "",
    suburb: "",
    city: "",
    postalCode: "",
    province: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) navigate("/tell");
  }, [userId, navigate]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (
      !form.streetName ||
      !form.suburb ||
      !form.city ||
      !form.postalCode ||
      !form.province
    ) {
      setError("All address fields are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/address`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          street_name_number: form.streetName,
          suburb: form.suburb,
          city: form.city,
          postal_code: form.postalCode,
          province: form.province,
          proof_of_address_path: "pending",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save address");
      }

      navigate("/contact", { state: { userId } });
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
              <b>Where Do You Live?</b>
            </h4>

            {error && <div className="text-danger mb-2">{error}</div>}

            <StreetNameInput
              value={form.streetName}
              onChange={(v) => updateField("streetName", v)}
            />

            <SuburbInput
              value={form.suburb}
              onChange={(v) => updateField("suburb", v)}
            />

            <CityInput
              value={form.city}
              onChange={(v) => updateField("city", v)}
            />

            <PostalInput
              value={form.postalCode}
              onChange={(v) => updateField("postalCode", v)}
            />

<ProvinceDropdown
  value={form.province}
  onChange={(v) => updateField("province", v)}
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

export default Where;
