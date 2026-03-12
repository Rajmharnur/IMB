import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Body.css";

const API_BASE = "http://localhost:5000";

const Profile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    employer: "",
    streetNameNumber: "",
    suburb: "",
    city: "",
    postalCode: "",
    province: "",
    idType: "",
    idNumber: "",
    countryOfIssue: "",
    permitIssueDate: "",
    permitExpiryDate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const id = payload.sub;
      setUserId(id);

      fetch(`${API_BASE}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const address = data.addresses?.[0];
          const identification = data.identifications?.[0];
          const workPermit = data.workPermits?.[0];

          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            dob: data.dob ? data.dob.slice(0, 10) : "",
            email: data.email || "",
            employer: data.employer || "",
            streetNameNumber: address?.streetNameNumber || "",
            suburb: address?.suburb || "",
            city: address?.city || "",
            postalCode: address?.postalCode || "",
            province: address?.province || "",
            idType: identification?.idType || "",
            idNumber: identification?.idNumber || "",
            countryOfIssue: identification?.countryOfIssue || "",
            permitIssueDate: workPermit?.issueDate ? workPermit.issueDate.slice(0, 10) : "",
            permitExpiryDate: workPermit?.expiryDate ? workPermit.expiryDate.slice(0, 10) : "",
          });
          setLoading(false);
        })
        .catch(() => { setError("Failed to load profile"); setLoading(false); });
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: form.firstName,
          last_name: form.lastName,
          dob: form.dob ? `${form.dob}T00:00:00` : null,
          email: form.email,
          employer: form.employer,
          street_name_number: form.streetNameNumber,
          suburb: form.suburb,
          city: form.city,
          postal_code: form.postalCode,
          province: form.province,
          id_type: form.idType,
          id_number: form.idNumber,
          country_of_issue: form.countryOfIssue,
          permit_issue_date: form.permitIssueDate ? `${form.permitIssueDate}T00:00:00` : null,
          permit_expiry_date: form.permitExpiryDate ? `${form.permitExpiryDate}T00:00:00` : null,
        }),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || "Failed to update profile");
      }
    } catch {
      setError("Server error");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: "300px", backgroundColor: "#F5F5F5" };

  const provinces = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"
  ];

  if (loading) return (
    <main className="py-5">
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Loading your profile...</p>
      </div>
    </main>
  );

  return (
    <main className="py-5">
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: "#2B26ED" }}>Edit Profile</h1>
          <button
            className="btn fw-bold px-4 py-2"
            onClick={() => navigate("/dashboard")}
            style={{
              backgroundColor: "white",
              color: "#2a2ac4",
              borderRadius: "50px",
              border: "2px solid #211aee",
            }}
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="row g-4">

          {/* Personal Details */}
          <div className="col-md-6">
            <div className="p-4 shadow-sm rounded" style={{ backgroundColor: "white", border: "1.5px solid #e0e0e0" }}>
              <h5 className="mb-3" style={{ color: "#2B26ED" }}><b>Personal Details</b></h5>

              <h6>First Name</h6>
              <input type="text" className="form-control mb-3" style={inputStyle}
                value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} />

              <h6>Last Name</h6>
              <input type="text" className="form-control mb-3" style={inputStyle}
                value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} />

              <h6>Date of Birth</h6>
              <input type="date" className="form-control mb-3" style={inputStyle}
                value={form.dob} onChange={(e) => updateField("dob", e.target.value)} />

              <h6>Email</h6>
              <input type="email" className="form-control mb-3" style={inputStyle}
                value={form.email} onChange={(e) => updateField("email", e.target.value)} />

              <h6>Employer</h6>
              <input type="text" className="form-control" style={inputStyle}
                value={form.employer} onChange={(e) => updateField("employer", e.target.value)} />
            </div>
          </div>

          {/* Address */}
          <div className="col-md-6">
            <div className="p-4 shadow-sm rounded" style={{ backgroundColor: "white", border: "1.5px solid #e0e0e0" }}>
              <h5 className="mb-3" style={{ color: "#2B26ED" }}><b>Address</b></h5>

              <h6>Street Name & Number</h6>
              <input type="text" className="form-control mb-3" style={inputStyle}
                value={form.streetNameNumber} onChange={(e) => updateField("streetNameNumber", e.target.value)} />

              <h6>Suburb</h6>
              <input type="text" className="form-control mb-3" style={inputStyle}
                value={form.suburb} onChange={(e) => updateField("suburb", e.target.value)} />

              <h6>City</h6>
              <input type="text" className="form-control mb-3" style={inputStyle}
                value={form.city} onChange={(e) => updateField("city", e.target.value)} />

              <h6>Postal Code</h6>
              <input type="text" className="form-control mb-3" style={inputStyle}
                value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} />

              <h6>Province</h6>
              <select className="form-control" style={inputStyle}
                value={form.province} onChange={(e) => updateField("province", e.target.value)}>
                <option value="">Select province</option>
                {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* ID Details */}
          <div className="col-md-6">
            <div className="p-4 shadow-sm rounded" style={{ backgroundColor: "white", border: "1.5px solid #e0e0e0" }}>
              <h5 className="mb-3" style={{ color: "#2B26ED" }}><b>Identification</b></h5>

              <h6>ID Type</h6>
              <select className="form-control mb-3" style={inputStyle}
                value={form.idType} onChange={(e) => updateField("idType", e.target.value)}>
                <option value="">Select ID type</option>
                <option value="ID Card">ID Card</option>
                <option value="Passport">Passport</option>
                <option value="Driver's License">Driver's License</option>
                <option value="Other">Other</option>
              </select>

              <h6>ID Number</h6>
              <input type="text" className="form-control mb-3" style={inputStyle}
                value={form.idNumber} onChange={(e) => updateField("idNumber", e.target.value)} />

              <h6>Country of Issue</h6>
              <input type="text" className="form-control" style={inputStyle}
                value={form.countryOfIssue} onChange={(e) => updateField("countryOfIssue", e.target.value)} />
            </div>
          </div>

          {/* Work Permit */}
          <div className="col-md-6">
            <div className="p-4 shadow-sm rounded" style={{ backgroundColor: "white", border: "1.5px solid #e0e0e0" }}>
              <h5 className="mb-3" style={{ color: "#2B26ED" }}><b>Work Permit</b></h5>

              <h6>Issue Date</h6>
              <input type="date" className="form-control mb-3" style={inputStyle}
                value={form.permitIssueDate} onChange={(e) => updateField("permitIssueDate", e.target.value)} />

              <h6>Expiry Date</h6>
              <input type="date" className="form-control" style={inputStyle}
                value={form.permitExpiryDate} onChange={(e) => updateField("permitExpiryDate", e.target.value)} />
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="mt-4">
          <button
            className="btn fw-bold px-5 py-2"
            onClick={handleSave}
            disabled={saving}
            style={{
              backgroundColor: "#e8ff67",
              color: "#2a2ac4",
              borderRadius: "50px",
              border: "2px solid #211aee",
            }}
          >
            {saving ? "Saving..." : "Save Changes"}
            <i className="bi bi-check-circle ms-2"></i>
          </button>
        </div>

      </div>
    </main>
  );
};

export default Profile;