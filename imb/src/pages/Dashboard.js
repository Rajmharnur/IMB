import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/Body.css";

const API_BASE = "http://localhost:5000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Decode JWT to get user id
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.sub;

      fetch(`${API_BASE}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user");
          return res.json();
        })
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load profile");
          setLoading(false);
        });
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <main className="py-5">
        <div className="container text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3">Loading your profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="py-5">
        <div className="container text-center mt-5">
          <p className="text-danger">{error}</p>
        </div>
      </main>
    );
  }

  const address = user?.addresses?.[0];
  const identification = user?.identifications?.[0];
  const workPermit = user?.workPermits?.[0];

  return (
    <main className="py-5">
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 style={{ color: "#2B26ED" }}>
            Welcome, <b>{user?.firstName}</b> 👋
          </h1>
          <button
            className="btn fw-bold px-4 py-2"
            onClick={handleLogout}
            style={{
              backgroundColor: "white",
              color: "#2a2ac4",
              borderRadius: "50px",
              border: "2px solid #211aee",
            }}
          >
            Logout
          </button>
        </div>

        <div className="row g-4">

          {/* Personal Details Card */}
          <div className="col-md-6">
            <div className="p-4 shadow-sm rounded" style={{ backgroundColor: "white", border: "1.5px solid #e0e0e0" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ color: "#2B26ED" }}><b>Personal Details</b></h5>
                <button
                  className="btn btn-sm fw-bold"
                  onClick={() => navigate("/profile")}
                  style={{
                    backgroundColor: "#e8ff67",
                    color: "#2a2ac4",
                    borderRadius: "50px",
                    border: "2px solid #211aee",
                    fontSize: "12px"
                  }}
                >
                  Edit Profile
                </button>
              </div>
              <p><b>First Name:</b> {user?.firstName}</p>
              <p><b>Last Name:</b> {user?.lastName}</p>
              <p><b>Date of Birth:</b> {user?.dob ? new Date(user.dob).toLocaleDateString() : "—"}</p>
              <p><b>Mobile:</b> {user?.mobileNumber}</p>
              <p><b>Email:</b> {user?.email || "—"}</p>
              <p><b>Employer:</b> {user?.employer}</p>
            </div>
          </div>

          {/* Address Card */}
          <div className="col-md-6">
            <div className="p-4 shadow-sm rounded" style={{ backgroundColor: "white", border: "1.5px solid #e0e0e0" }}>
              <h5 className="mb-3" style={{ color: "#2B26ED" }}><b>Address</b></h5>
              {address ? (
                <>
                  <p><b>Street:</b> {address.streetNameNumber}</p>
                  <p><b>Suburb:</b> {address.suburb || "—"}</p>
                  <p><b>City:</b> {address.city}</p>
                  <p><b>Postal Code:</b> {address.postalCode}</p>
                  <p><b>Province:</b> {address.province}</p>
                </>
              ) : <p className="text-muted">No address on record</p>}
            </div>
          </div>

          {/* ID Details Card */}
          <div className="col-md-6">
            <div className="p-4 shadow-sm rounded" style={{ backgroundColor: "white", border: "1.5px solid #e0e0e0" }}>
              <h5 className="mb-3" style={{ color: "#2B26ED" }}><b>Identification</b></h5>
              {identification ? (
                <>
                  <p><b>ID Type:</b> {identification.idType}</p>
                  <p><b>ID Number:</b> {identification.idNumber}</p>
                  <p><b>Country of Issue:</b> {identification.countryOfIssue}</p>
                </>
              ) : <p className="text-muted">No identification on record</p>}
            </div>
          </div>

          {/* Work Permit Card */}
          <div className="col-md-6">
            <div className="p-4 shadow-sm rounded" style={{ backgroundColor: "white", border: "1.5px solid #e0e0e0" }}>
              <h5 className="mb-3" style={{ color: "#2B26ED" }}><b>Work Permit</b></h5>
              {workPermit ? (
                <>
                  <p><b>Issue Date:</b> {new Date(workPermit.issueDate).toLocaleDateString()}</p>
                  <p><b>Expiry Date:</b> {new Date(workPermit.expiryDate).toLocaleDateString()}</p>
                </>
              ) : <p className="text-muted">No work permit on record</p>}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Dashboard;