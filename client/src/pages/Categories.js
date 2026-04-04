import React from "react";
import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title={"All Categories"}>
      <style>{`
        .category-wrapper {
          margin-top: 100px;
        }

        .category-title {
          font-weight: 600;
          color: #1e293b;
        }

        .category-card {
          border-radius: 16px;
          border: 1px solid #e6efff;
          padding: 25px;
          text-align: center;
          background: #ffffff;
          transition: all 0.25s ease;
          height: 100%;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15);
          background: #f8fbff;
        }

        .category-name {
          font-size: 16px;
          font-weight: 600;
          color: #2563eb;
        }

        .category-link {
          text-decoration: none;
        }
      `}</style>

      <div className="container category-wrapper">
        {/* TITLE */}
        <div className="text-center mb-4">
          <h3 className="category-title">All Categories</h3>
        </div>

        {/* GRID */}
        <div className="row">
          {categories.map((c) => (
            <div className="col-md-4 col-sm-6 mb-4" key={c._id}>
              <Link to={`/category/${c.slug}`} className="category-link">
                <div className="category-card">
                  <div className="category-name">{c.name}</div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
