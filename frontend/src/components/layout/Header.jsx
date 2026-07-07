import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Route, Routes } from "react-router-dom";
import { logout } from "../../redux/actions/userActions";
import { toast } from "react-toastify";

import Search from "./Search";
import "../../App.css";

const Header = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
  };

  return (
    <>
      <nav className="navbar row sticky-top">
        {/* Logo */}
        <div className="col-12 col-md-3">
          <Link to="/">
            <img src="/images/logo.webp" alt="logo" className="logo" />
          </Link>
        </div>

        {/* Search */}
        <div className="col-12 col-md-6 mt-2 mt-md-0">
          <Routes>
            <Route path="/" element={<Search />} />
            <Route
              path="/eats/stores/search/:keyword"
              element={<Search />}
            />
          </Routes>
        </div>

        {/* Right Side */}
        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span className="ms-3" id="cart">
              Cart
            </span>

            <span className="ms-1" id="cart_count">
              {cartItems.length}
            </span>
          </Link>

          {user ? (
            <div className="ms-4 dropdown d-inline">
              <Link
                to="/"
                className="btn dropdown-toggle text-white me-4"
                id="dropDownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar?.url}
                    alt={user.name}
                    className="rounded-circle"
                  />
                </figure>

                <span>{user.name}</span>
              </Link>

              <ul
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                <li>
                  <Link
                    className="dropdown-item"
                    to="/eats/orders/me/myOrders"
                  >
                    Orders
                  </Link>
                </li>

                <li>
                  <Link className="dropdown-item" to="/users/me">
                    Profile
                  </Link>
                </li>

                <li>
                  <Link
                    className="dropdown-item text-danger"
                    to="/"
                    onClick={logoutHandler}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              to="/users/login"
              className="btn btn-light ms-4"
              id="login_btn"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;