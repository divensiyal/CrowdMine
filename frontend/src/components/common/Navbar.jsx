import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__inner">

        {/* Brand */}

        <NavLink
          to="/"
          className="navbar__brand"
        >
          CrowdMine
        </NavLink>


        {/* Navigation */}

        <div className="navbar__links">

          {user ? (
            <>
              <NavLink
                to="/dashboard"
                className="navbar__link"
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/requests"
                className="navbar__link"
              >
                Requests
              </NavLink>

              <NavLink
                to="/contributions"
                className="navbar__link"
              >
                Contributions
              </NavLink>

              <NavLink
                to="/datasets"
                className="navbar__link"
              >
                Datasets
              </NavLink>

              <NavLink
                to="/profile"
                className="navbar__profile"
              >
                {user.username}
              </NavLink>

              <button
                type="button"
                className="navbar__logout"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="navbar__link"
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className="navbar__register"
              >
                Get Started
              </NavLink>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;