// import React from 'react'
// import Layout from '../components/Layout/Layout'

// const HomePage = () => {
//   return (

//         <Layout>
//       <h1>Page not found!!</h1>
//       </Layout>

//   )
// }

// export default HomePage

import React from "react";
import Layout from "../components/Layout/Layout";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <Layout title={"Page Not Found"}>
      <style>{`
        .notfound-wrapper {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
          padding: 20px;
        }

        .notfound-card {
          text-align: center;
          max-width: 500px;
          background: #ffffff;
          border-radius: 20px;
          padding: 40px 30px;
          box-shadow: 0 15px 40px rgba(0, 102, 255, 0.08);
          border: 1px solid #e6efff;
        }

        .notfound-icon {
         font-size: 40px;
        color: #ef4444; /* red */
        margin-bottom: 15px;
          }

        .notfound-heading {
          font-size: 70px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .notfound-subheading {
          font-size: 18px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 10px;
        }

        .notfound-text {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 20px;
        }

        .home-btn {
          display: inline-block;
          padding: 10px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .home-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
        }
      `}</style>

      <div className="notfound-wrapper">
        <div className="notfound-card">
          <div className="notfound-icon">
            <FaExclamationTriangle />
          </div>

          <div className="notfound-heading">404</div>

          <div className="notfound-subheading">Oops! Page not found</div>

          <div className="notfound-text">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </div>

          <Link to="/" className="home-btn">
            Go to Homepage
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default PageNotFound;
