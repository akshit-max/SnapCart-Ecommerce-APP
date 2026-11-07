import { Link } from "react-router-dom";

const CATEGORY_VISUALS = [
  {
    slug: "mens-collection",
    name: "Men's Sartorial",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&q=80",
    badge: "Tailoring",
  },
  {
    slug: "women-collection",
    name: "Women's Fashion",
    image: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=300&q=80",
    badge: "Luxury Silks",
  },
  {
    slug: "electronics",
    name: "Tech & Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    badge: "Studio Sound",
  },
  {
    slug: "footwear",
    name: "Sneakers & Shoes",
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=300&q=80",
    badge: "Heritage",
  },
  {
    slug: "accessories",
    name: "Watches & Leather",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=300&q=80",
    badge: "Chronographs",
  },
  {
    slug: "fragrance",
    name: "Fragrance & Care",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&q=80",
    badge: "Parfums",
  },
  {
    slug: "eyewear",
    name: "Luxury Eyewear",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300&q=80",
    badge: "Handcrafted",
  },
  {
    slug: "travel-luggage",
    name: "Travel & Luggage",
    image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=300&q=80",
    badge: "Carry-On",
  },
  {
    slug: "home-living",
    name: "Home & Living",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&q=80",
    badge: "Living Spaces",
  },
  {
    slug: "kids-collection",
    name: "Kids & Teens",
    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=300&q=80",
    badge: "Organic Cotton",
  },
];

const CategoryVisualRow = ({ activeSlug, onSelectCategory }) => {
  return (
    <div className="category-visual-wrapper mb-5">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="fw-bold text-dark mb-0">Explore Curated Departments</h5>
          <span className="small text-muted" style={{ fontSize: "12px" }}>Select a collection to filter live catalog</span>
        </div>
        <Link to="/categories" className="small fw-semibold text-primary text-decoration-none">
          All Collections &rarr;
        </Link>
      </div>

      <div className="category-visual-scroll">
        {CATEGORY_VISUALS.map((item) => {
          const isActive = activeSlug === item.slug;
          return (
            <div
              key={item.slug}
              className={`category-visual-item ${isActive ? "active" : ""}`}
              onClick={() => onSelectCategory(item.slug)}
            >
              <div className="category-circle-img">
                <img src={item.image} alt={item.name} loading="lazy" />
              </div>
              <span className="category-circle-label text-truncate" style={{ maxWidth: 100 }}>
                {item.name}
              </span>
              <span className="category-circle-badge">{item.badge}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryVisualRow;
