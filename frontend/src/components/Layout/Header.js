import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { 
  FiShoppingBag, 
  FiShoppingCart, 
  FiUser, 
  FiLogOut, 
  FiGrid, 
  FiChevronDown,
  FiX
} from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/cart";
import useCategory from "../../hooks/useCategory";
import SearchInput from "../Form/SearchInput";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const { cartCount } = useCart();
  const categories = useCategory();
  const navigate = useNavigate();
  const [showRibbon, setShowRibbon] = useState(true);

  const handleLogout = () => {
    setAuth({ user: null, token: "" });
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="fixed-top header-fixed-wrapper">
      {/* Top Announcement Bar */}
      {showRibbon && (
        <div className="top-announcement-bar">
          <div className="container d-flex align-items-center justify-content-between position-relative">
            <div className="mx-auto text-center small d-flex align-items-center gap-2">
              <span className="badge bg-warning text-dark fw-bold px-2 py-0.5" style={{ fontSize: "10px" }}>
                FLASH DEAL
              </span>
              <span>
                Use code <b className="text-warning">SNAPCART20</b> for 20% OFF • Free Express Shipping on ₹999+
              </span>
            </div>
            <button
              className="btn btn-link text-white p-0 position-absolute end-0 me-3 d-none d-md-block opacity-75 hover-opacity-100"
              onClick={() => setShowRibbon(false)}
              aria-label="Dismiss banner"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Navbar */}
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="container">
          {/* Brand Logo */}
          <Link className="navbar-brand brand-logo-wrap" to="/">
            <div className="brand-icon-box">
              <FiShoppingBag />
            </div>
            <span>
              Snap<span className="brand-text-gradient">Cart</span>
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Central Search */}
            <div className="mx-auto my-2 my-lg-0">
              <SearchInput />
            </div>

            {/* Navigation Links */}
            <ul className="navbar-nav align-items-lg-center gap-1 gap-lg-2">
              <li className="nav-item">
                <NavLink className="nav-link" to="/" end>
                  Home
                </NavLink>
              </li>

              {/* Categories Dropdown */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link d-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span>Categories</span>
                  <FiChevronDown size={14} />
                </button>
                <ul className="dropdown-menu shadow-lg border-0 rounded-3 p-2">
                  <li>
                    <Link className="dropdown-item py-2 fw-semibold" to="/categories">
                      <FiGrid className="me-2 text-primary" /> All Categories
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  {categories.map((c) => (
                    <li key={c._id}>
                      <Link className="dropdown-item py-2" to={`/category/${c.slug}`}>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Auth Nav Links */}
              {!auth?.user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <Link className="btn btn-brand btn-sm px-3" to="/login">
                      Sign In
                    </Link>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link d-flex align-items-center gap-2"
                    data-bs-toggle="dropdown"
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      {auth.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="fw-semibold">{auth.user.name}</span>
                    <FiChevronDown size={14} />
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 p-2">
                    <li className="px-3 py-2 border-bottom mb-1">
                      <p className="mb-0 small fw-bold text-dark">{auth.user.name}</p>
                      <p className="mb-0 small text-muted text-truncate" style={{ maxWidth: "180px" }}>
                        {auth.user.email}
                      </p>
                      <span className="badge bg-primary-subtle text-primary mt-1" style={{ fontSize: "10px" }}>
                        {auth.user.role === 1 ? "Admin Portal" : "Customer"}
                      </span>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item py-2 d-flex align-items-center gap-2"
                        to={auth.user.role === 1 ? "/dashboard/admin" : "/dashboard/user"}
                      >
                        <FiGrid size={15} /> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item py-2 d-flex align-items-center gap-2"
                        to={auth.user.role === 1 ? "/dashboard/admin/orders" : "/dashboard/user/orders"}
                      >
                        <FiUser size={15} /> My Orders
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider my-1" /></li>
                    <li>
                      <button
                        className="dropdown-item py-2 text-danger d-flex align-items-center gap-2"
                        onClick={handleLogout}
                      >
                        <FiLogOut size={15} /> Sign Out
                      </button>
                    </li>
                  </ul>
                </li>
              )}

              {/* Cart Button */}
              <li className="nav-item ms-lg-2">
                <Link className="cart-nav-btn text-decoration-none" to="/cart" aria-label="Shopping Cart">
                  <FiShoppingCart size={18} />
                  <span className="d-none d-xl-inline">Cart</span>
                  <Badge count={cartCount} showZero size="small" offset={[2, -2]} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
