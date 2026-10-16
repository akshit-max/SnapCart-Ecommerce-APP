import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title="All Categories">
      <div className="container mt-3">
        <h3 className="page-title mb-4">All Categories</h3>
        <div className="row g-4">
          {categories.map((c) => (
            <div className="col-6 col-md-4 col-lg-3" key={c._id}>
              <Link to={`/category/${c.slug}`} className="text-decoration-none">
                <div className="card-box product-card text-center justify-content-center">
                  <span className="fw-semibold">{c.name}</span>
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
