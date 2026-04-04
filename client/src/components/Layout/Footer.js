import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto shadow-lg">
      <div className="container text-center">
        <h5 className="mb-3">SnapCart &copy; {new Date().getFullYear()} | All Rights Reserved</h5>
        <div className="d-flex justify-content-center gap-4">
          <Link to="/about" className="text-decoration-none text-light footer-link">
            About Us
          </Link>
          <Link to="/contact" className="text-decoration-none text-light footer-link">
            Contact
          </Link>
          <Link to="/policy" className="text-decoration-none text-light footer-link">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;






