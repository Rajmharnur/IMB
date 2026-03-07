import React from "react";
import "../components/Body.css";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav
      className="navbar navbar-expand-lg  px-5 "
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="container-fluid">
        {/* LOGO + WELCOME */}
        <a
          className="navbar-brand d-flex flex-column align-items-center mr-4 px-5"
          href="/"
        >
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "82px", height: "82px" }}
          />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            className="navbar-nav me-auto mb-2 mb-lg-0"
            style={{ color: "#888D94" }}
          >
            {[
              "Home",
              "Smart Dr",
              "Products & Services",
              "About Us",
              "Gallery",
              "Legal",
              "FAQ",
              "Contact Us",
              <div className="align-items-start ">
                <button
                  className="btn fw-bold py-0"
                  onClick={() => navigate("/login")}
                  style={{
                    backgroundColor: "#F8F8F8",
                    color: "#2a2ac4",
                    borderRadius: "45px",
                    fontSize: "1rem",
                  }}
                >
                  PERSONAL LOGIN
                </button>
              </div>,
              <div className="align-items-start">
                <button
                  className="btn fw-bold py-1"
                  onClick={() => navigate("/apply")}
                  style={{
                    backgroundColor: "#CBE537",
                    color: "#2a2ac4",
                    borderRadius: "50px",
                    border: "2px solid #211aee",
                    fontSize: "1rem",
                  }}
                >
                  Self Sign-Up
                </button>
              </div>,
            ].map((item) => (
              <li className="nav-item" key={item}>
                <a className="nav-link active " href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
