import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiStar } from "react-icons/fi";

const HERO_SLIDES = [
  {
    id: 1,
    tag: "✨ NEW DROP 2026",
    tagColor: "bg-primary",
    title: "The Autumn / Winter Luxury Collection",
    subtitle: "Impeccably tailored Italian wool blazers, Mulberry silk shirts, and heavyweight Japanese selvage denim.",
    ctaText: "Shop Collection",
    ctaLink: "/category/mens-collection",
    bgImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&q=80",
    badge: "Limited Stock",
  },
  {
    id: 2,
    tag: "⚡ HIGH-FIDELITY AUDIO",
    tagColor: "bg-warning text-dark",
    title: "Flagship Sound & Studio Workspaces",
    subtitle: "Featuring the Sony WH-1000XM5, Marshall 360° True Stereophonic sound, and Keychron custom keyboards.",
    ctaText: "Explore Tech",
    ctaLink: "/category/electronics",
    bgImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1400&q=80",
    badge: "Trending Tech",
  },
  {
    id: 3,
    tag: "👟 SNEAKERHEAD VAULT",
    tagColor: "bg-danger",
    title: "Iconic Air Jordans & Ultraboost Light",
    subtitle: "The culture's most sought-after silhouettes. Handcrafted leather Chelsea boots and retro heritage classics.",
    ctaText: "Shop Footwear",
    ctaLink: "/category/footwear",
    bgImage: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1400&q=80",
    badge: "Hot Release",
  },
  {
    id: 4,
    tag: "💎 BESPOKE FRAGRANCE & EYEWEAR",
    tagColor: "bg-info text-dark",
    title: "Artisanal Parfums & Titanium Frames",
    subtitle: "Bleu Royale, Santal & Haitian Vetiver colognes, and handcrafted Japanese acetate sunglasses.",
    ctaText: "Explore Collection",
    ctaLink: "/category/fragrance",
    bgImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1400&q=80",
    badge: "Exclusive",
  },
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="hero-carousel-container">
      {HERO_SLIDES.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`hero-slide ${isActive ? "active" : ""}`}
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.65) 50%, rgba(15, 23, 42, 0.25) 100%), url(${slide.bgImage})`,
            }}
          >
            <div className="hero-slide-content">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className={`badge ${slide.tagColor} px-3 py-2 rounded-pill fw-bold`}>
                  {slide.tag}
                </span>
                <span className="badge bg-white text-dark px-3 py-2 rounded-pill fw-bold d-none d-sm-inline-block">
                  <FiStar fill="#f59e0b" className="text-warning me-1" /> {slide.badge}
                </span>
              </div>

              <h1 className="hero-slide-title">{slide.title}</h1>
              <p className="hero-slide-subtitle">{slide.subtitle}</p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link to={slide.ctaLink} className="btn btn-brand px-4 py-3 fw-bold fs-6">
                  {slide.ctaText} <FiArrowRight className="ms-1" />
                </Link>
                <Link to="/categories" className="btn btn-outline-light px-4 py-3 rounded-3 fw-semibold">
                  All Categories
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button className="carousel-nav-btn prev" onClick={prevSlide} aria-label="Previous Slide">
        <FiChevronLeft size={22} />
      </button>
      <button className="carousel-nav-btn next" onClick={nextSlide} aria-label="Next Slide">
        <FiChevronRight size={22} />
      </button>

      {/* Indicator Dots */}
      <div className="carousel-indicators-custom">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

