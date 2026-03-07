import React, { useState } from "react";
import "../components/Body.css";
import "./Application.css";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [useOtp, setUseOtp] = useState(false);
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {

    if (useOtp) {
      if (!mobile) {
        setError("Mobile number required");
        return;
      }

      navigate("/otp", { state: { mobile } });
    } 
    else {
      if (!userName || !password) {
        setError("Username and Password required");
        return;
      }

      console.log("Login with username/password");
    }
  };

  return (
    <main className="py-5">
      <div className="centered-content">
        <div className="text-center mb-4">
          <h1 style={{ color: "#2B26ED" }}>Login</h1>
        </div>
      </div>

      <div className="container text-start">
        <div className="row">

          {/* LEFT COLUMN */}
          <div className="col-md-4">

            {/* Toggle Login Method */}
            <div className="mb-3">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => setUseOtp(false)}
              >
                Password Login
              </button>

              <button
                className="btn btn-outline-success"
                onClick={() => setUseOtp(true)}
              >
                Login with OTP
              </button>
            </div>

            {/* USERNAME LOGIN */}
            {!useOtp && (
              <>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ width: "300px", backgroundColor: "#F5F5F5" }}
                />

                <div className="input-group mb-3" style={{ width: "300px" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ backgroundColor: "#F5F5F5" }}
                  />

                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </>
            )}

            {/* OTP LOGIN */}
            {useOtp && (
              <input
                type="tel"
                className="form-control mb-3"
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                style={{ width: "300px", backgroundColor: "#F5F5F5" }}
              />
            )}

            {error && <small style={{ color: "red" }}>{error}</small>}

            {/* LOGIN BUTTON */}
            <div className="mt-4">
              <button
                className="btn fw-bold px-4 py-2"
                onClick={handleLogin}
                style={{
                  backgroundColor: "#e8ff67",
                  color: "#2a2ac4",
                  borderRadius: "50px",
                  border: "2px solid #211aee",
                }}
              >
                {useOtp ? "Send OTP" : "Login"}
              </button>
            </div>
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

export default Login;