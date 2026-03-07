import React from "react";
import { useNavigate } from "react-router-dom";
const Body = () => {
  const navigate = useNavigate();
  return (
    <main className="py-5">
      <div className="centered-content">
        <div className="text-center mb-4">
          <h1 style={{ color: "#2B26ED" }}>Self Sign-up</h1>
        </div>
      </div>

      <div className="container">
        {/* Row: Welcome + Card Image */}
        <div className="row align-items-start">
          {/* Left Column */}
          <div className="col-md-4">
            <h3 className="mb-0">
              <strong>Welcome</strong>
            </h3>
            <h5 className="mb-3">Open your account in a few easy steps</h5>

            {/* Checklist (now properly separated) */}
            <h6>
              <b>Here’s what you’ll need before you start:</b>
            </h6>
            <ul className="list-unstyled mb-3">
              <li className="mb-2">✅ South African mobile number</li>
              <li className="mb-2">✅ 18 years or older</li>
              <li className="mb-2">
                ✅ SA ID, Passport, or Asylum/Refugee document (permit if required)
              </li>
              <li className="mb-2">
                ✅ Proof of address (not older than 3 months)
              </li>
              <li className="mb-2">✅ A selfie holding your ID</li>
            </ul>

            <div className="text-center mt-4">
              <button
                className="btn fw-bold px-4 py-2"
                onClick={() => navigate("/apply")}
                style={{
                  backgroundColor: "#e8ff67",
                  color: "#2a2ac4",
                  borderRadius: "50px",
                  border: "2px solid #211aee",
                  fontSize: "1rem",
                }}
                
              >
                Start my application
                <i className="bi bi-arrow-right-circle ms-2"  ></i>
              </button>
            </div>

            <h6 className="mt-3 " style={{ fontSize: "0.9rem" }}>
              By clicking “Start my application”, you accept all IMB terms and
              conditions <br />
              <a
                href="https://imb.datafree.co/legal/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://imb.datafree.co/legal/
              </a>
            </h6>
          </div>

          {/* Right Column: Card Image */}
          <div className="col-md-6 d-flex justify-content-start">
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
export default Body;
