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








// import React from "react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer
//       style={{
//         background: "#ffffff",
//         borderTop: "1px solid #e5e7eb",
//         marginTop: "auto",
//       }}
//     >
//       <div className="container py-5">

//         <div className="row align-items-start justify-content-between">

//           {/* Brand Section */}
//           <div className="col-md-4 mb-4">
//             <h4
//               style={{
//                 color: "#1e293b",
//                 fontWeight: "700",
//                 letterSpacing: "0.5px",
//               }}
//             >
//               SnapCart
//             </h4>

//             <p
//               style={{
//                 color: "#64748b",
//                 marginTop: "12px",
//                 fontSize: "14px",
//                 lineHeight: "1.6",
//               }}
//             >
//               A modern ecommerce platform built for seamless shopping and
//               powerful admin control.
//             </p>
//           </div>

//           {/* Links */}
//           <div className="col-md-2 mb-4">
//             <h6
//               style={{
//                 color: "#1e293b",
//                 fontWeight: "600",
//                 marginBottom: "12px",
//               }}
//             >
//               Company
//             </h6>

//             <div className="d-flex flex-column gap-2">
//               <Link to="/about" className="footer-link">About</Link>
//               <Link to="/contact" className="footer-link">Contact</Link>
//               <Link to="/policy" className="footer-link">Privacy</Link>
//             </div>
//           </div>

//         </div>

//         {/* Divider */}
//         <hr
//           style={{
//             borderColor: "#e5e7eb",
//             margin: "25px 0",
//           }}
//         />

//         {/* Bottom */}
//         <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">

//           <p
//             style={{
//               margin: 0,
//               color: "#94a3b8",
//               fontSize: "13px",
//             }}
//           >
//             © {new Date().getFullYear()} SnapCart. All rights reserved.
//           </p>

//           <div className="mt-2 mt-md-0">
//             <span
//               style={{
//                 fontSize: "13px",
//                 color: "#64748b",
//               }}
//             >
//               Made with <span style={{ color: "#ef4444" }}>❤️</span>
//             </span>
//           </div>

//         </div>

//       </div>

//       {/* Styles */}
//       <style>
//         {`
//           .footer-link {
//             text-decoration: none;
//             color: #475569;
//             font-size: 14px;
//             transition: all 0.2s ease;
//           }

//           .footer-link:hover {
//             color: #2563eb;
//             transform: translateX(4px);
//           }
//         `}
//       </style>
//     </footer>
//   );
// };

// export default Footer;