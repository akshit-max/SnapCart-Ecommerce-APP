import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const PROMOS = [
  {
    id: 1,
    title: "Men's Sartorial Edit",
    subtitle: "Italian wool blazers & French terry streetwear",
    link: "/category/mens-collection",
    badge: "New Season",
    bg: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&q=80",
  },
  {
    id: 2,
    title: "Women's Luxury Silk",
    subtitle: "Mulberry silk shirts & cashmere knitwear",
    link: "/category/women-collection",
    badge: "Trending",
    bg: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80",
  },
  {
    id: 3,
    title: "Studio Tech & Acoustics",
    subtitle: "Noise cancelling audio & mechanical keyboards",
    link: "/category/electronics",
    badge: "Best Seller",
    bg: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
  },
];

const PromoBanners = () => {
  return (
    <div className="row g-4 mb-5">
      {PROMOS.map((promo) => (
        <div className="col-md-4" key={promo.id}>
          <Link to={promo.link} className="text-decoration-none">
            <div
              className="promo-card"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.2) 0%, rgba(15, 23, 42, 0.85) 100%), url(${promo.bg})`,
              }}
            >
              <div className="promo-badge-tag">{promo.badge}</div>
              <div className="promo-content">
                <h4 className="promo-title">{promo.title}</h4>
                <p className="promo-subtitle">{promo.subtitle}</p>
                <span className="promo-link-text">
                  Shop Collection <FiArrowRight className="ms-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PromoBanners;

