import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Menu, X, Bookmark } from "lucide-react"; // for mobile toggle icons

const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-lg border-b border-white/20 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 md:py-4">
        {/* Brand */}
        <Link
          to="/"
          className="text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent tracking-tight"
        >
          xValue
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-[15px] font-medium transition duration-200 ${
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "text-gray-700 hover:text-indigo-500"
              }`
            }
          >
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/create-listing"
                className={({ isActive }) =>
                  `text-[15px] font-medium transition duration-200 ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700 hover:text-indigo-500"
                  }`
                }
              >
                Create Listing
              </NavLink>

              <NavLink
                to="/my-listings"
                className={({ isActive }) =>
                  `text-[15px] font-medium transition duration-200 ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700 hover:text-indigo-500"
                  }`
                }
              >
                My Listings
              </NavLink>

              <NavLink
                to="/bookmarks"
                className={({ isActive }) =>
                  `text-[15px] font-medium transition duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-gray-700 hover:text-indigo-500"
                  }`
                }
              >
                <Bookmark className="w-4 h-4" />
                Saved Cars
              </NavLink>

              <span className="text-gray-800 font-semibold">
                {user?.name || "User"}
              </span>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-red-500 hover:text-red-600 transition font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 font-semibold"
            >
              Login / Sign Up
            </Link>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/80 backdrop-blur-md border-t border-gray-200 shadow-sm px-6 py-4 space-y-4">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-800 hover:text-indigo-600 font-medium"
          >
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to="/create-listing"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-800 hover:text-indigo-600 font-medium"
              >
                Create Listing
              </NavLink>
              <NavLink
                to="/my-listings"
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-800 hover:text-indigo-600 font-medium"
              >
                My Listings
              </NavLink>

              <NavLink
                to="/bookmarks"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 text-gray-800 hover:text-indigo-600 font-medium"
              >
                <Bookmark className="w-4 h-4" />
                Saved Cars
              </NavLink>

              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">
                  {user?.name || "User"}
                </span>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-red-500 font-medium hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-lg shadow hover:shadow-lg transition font-semibold"
            >
              Login / Sign Up
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
