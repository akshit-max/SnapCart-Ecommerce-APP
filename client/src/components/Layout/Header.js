import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart() || [];
  const categories = useCategory();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm fixed-top">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold text-dark" to="/">
          🛒 SnapCart
        </Link>

        {/* Toggle */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Search */}
          <div className="ms-auto me-3">
            <SearchInput />
          </div>

          <ul className="navbar-nav align-items-center gap-2">
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/">
                Home
              </NavLink>
            </li>

            {/* Categories */}
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle text-dark"
                to="/categories"
                data-bs-toggle="dropdown"
              >
                Categories
              </Link>

              <ul className="dropdown-menu shadow-sm border-0 rounded-3">
                <li>
                  <Link className="dropdown-item" to="/categories">
                    All Categories
                  </Link>
                </li>

                {categories?.map((c) => (
                  <li key={c._id}>
                    <Link className="dropdown-item" to={`/category/${c.slug}`}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Auth */}
            {!auth?.user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link text-dark" to="/register">
                    Register
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="btn btn-dark btn-sm px-3" to="/login">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle text-dark"
                  data-bs-toggle="dropdown"
                  style={{ cursor: "pointer" }}
                >
                  {auth?.user?.name}
                </span>

                <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 rounded-3">
                  <li>
                    <NavLink
                      to={`/dashboard/${
                        auth?.user?.role === 1 ? "admin" : "user"
                      }`}
                      className="dropdown-item"
                    >
                      Dashboard
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      onClick={handleLogout}
                      to="/login"
                      className="dropdown-item text-danger"
                    >
                      Logout
                    </NavLink>
                  </li>
                </ul>
              </li>
            )}

            {/* Cart */}
            <li className="nav-item">
              <NavLink className="nav-link text-dark" to="/cart">
                <Badge count={cart?.length || 0} showZero>
                  <AiOutlineShoppingCart size={20} />
                </Badge>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
