import { Link } from "react-router-dom";
import useCategory from "../hooks/useCategory";
import Layout from "../components/Layout/Layout";
import { FiArrowRight } from "react-icons/fi";

const CATEGORY_META = {
  electronics: { icon: "📱", desc: "Headphones, smartwatches, keyboards & audio" },
  footwear: { icon: "👟", desc: "Running shoes, casual sneakers & boots" },
  "mens-collection": { icon: "👔", desc: "Shirts, jackets, sweaters & everyday essentials" },
  "women-collection": { icon: "👗", desc: "Dresses, coats, trousers & bags" },
  accessories: { icon: "🎒", desc: "Chronographs, sunglasses, wallets & travel gear" },
  fragrance: { icon: "✨", desc: "Eau de parfum, colognes & precision grooming sets" },
  eyewear: { icon: "🕶️", desc: "Handcrafted acetate frames & polarized aviators" },
  "travel-luggage": { icon: "🧳", desc: "Polycarbonate spinners, weekender duffels & tech folios" },
  "kids-collection": { icon: "👶", desc: "Comfortable, playful styles for kids and teens" },
  "home-living": { icon: "🏠", desc: "Ceramics, ambient lamps & home fragrance" },
};

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title="All Categories - SnapCart">
      <div className="container py-4">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary fw-bold px-3 py-2 rounded-pill mb-2">
            COLLECTIONS
          </span>
          <h2 className="fw-bold text-dark">Explore by Category</h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: "480px" }}>
            Browse through our curated departments to find exactly what you need.
          </p>
        </div>

        <div className="row g-4">
          {categories.map((c) => {
            const meta = CATEGORY_META[c.slug] || { icon: "🛍️", desc: "Explore curated items in this collection" };
            return (
              <div className="col-12 col-sm-6 col-lg-4" key={c._id}>
                <Link to={`/category/${c.slug}`} className="text-decoration-none">
                  <div className="card-box h-100 p-4 transition" style={{ transition: "all 0.25s ease" }}>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="fs-1">{meta.icon}</div>
                      <span className="badge bg-light text-primary border fw-bold px-2 py-1 small">
                        Explore <FiArrowRight className="ms-1" />
                      </span>
                    </div>
                    <h5 className="fw-bold text-dark mb-1">{c.name}</h5>
                    <p className="text-muted small mb-0">{meta.desc}</p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
