import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white text-dark py-4">
      <div className="container">
        <div className="row justify-content-center text-center text-md-start">
          
          {/* Left Section: Brand */}
          <div className="col-md-4 ">
          <a className="navbar-brand d-flex flex-column align-items-start " href="/">
          <img
            src="/logo.png"
            alt="logo"
            style={{ width: "65px", height: "65px" }}
          />
        </a>
            <p>
              IMB Financial Services Pty Ltd, is an authorised Financial Services Provider (FSP43443) and an authorised co-branded partner of Flexpay Pty Ltd, Reg. No. 2007/007066/07, an authorised distribution channel of Access Bank South Africa Limited, Reg. No.: 1947/025414/06 an authorised Financial Services Provider (FSP 5865).
            </p>
            <p>
              Our vision is to drive financial inclusion for all. Our mission is to open doors to new opportunities through the provision of disruptive and innovative financial products and solutions. We leverage technology to build convenience and simplicity.
            </p>
          </div>
          
          {/* Middle Section: Links */}
          <div className="col-md-4">
          <div className="custom-underline"><h5>Products</h5></div>
            <ul className="list-unstyled">
              <li><h6>IMB Personal Packages</h6></li>
              <br />
              <li><h6>Remittance (coming soon)</h6></li>
              <br />
              <li><h6>Affordable Distribution</h6></li>
              <br />
            </ul>
          </div>
          
          {/* Right Section: Get in Touch */}
          <div className="col-md-4 ">
          <div className="custom-underline"><h5>Get in touch</h5></div>
            {/* Address Block */}
            <div className="d-flex align-items-start">
    <i className="bi bi-geo-alt-fill me-2"></i>
   <div style={{ whiteSpace: "pre-line" }}>
  <span>2nd Floor, The Hills</span><br />
  Buchanan Square<br />
  160 Sir Lowry Rd, Woodstock<br />
  Cape Town<br />
  7925<br />
  South Africa
</div>
  </div>
            {/* Phone Block 1 */}
            <div className="d-flex align-items-start mt-2">
              <i className="bi bi-telephone-fill me-2"></i>
              <span>078 993 4703</span>
            </div>
            {/* Phone Block 2 */}
            <div className="d-flex align-items-start mt-2">
              <i className="bi bi-telephone-fill me-2"></i>
              <span>087 941 3252</span>
            </div>
            {/* Email Block */}
            <div className="d-flex align-items-start">
              <i className="bi bi-envelope me-2"></i>
              <span>support@imb.co</span>
            </div>
            <div className="d-flex align-items-start mt-2">
            <i className="fa-brands fa-facebook me-2"></i>
            <i className="fa-brands fa-x-twitter me-2"></i>
            <i className="fa-brands fa-linkedin "></i>
        </div>
        <div className="d-flex align-items-start mt-2">
        <p>cookie | privacy | terms of use</p>
        </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;