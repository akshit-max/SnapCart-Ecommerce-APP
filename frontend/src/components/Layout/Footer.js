import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span>SnapCart &copy; {new Date().getFullYear()}</span>
        <div className="d-flex gap-4">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/policy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
