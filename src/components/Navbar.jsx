import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const dropdownRef = useRef(null);

  const apiKey = import.meta.env.VITE_TMDB_API_KEY; // Access API Key from env

  // Fetch user data from localStorage
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (loggedIn && storedUser) {
      setIsLoggedIn(true);
      setUser(storedUser);
    }
  }, []);

  // Handle Logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  }, [navigate]);

  // Fetch movies dynamically from TMDB API based on search input
  useEffect(() => {
    const fetchMovies = async () => {
      if (!searchTerm.trim()) {
        setFilteredMovies([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}&language=en-US&page=1`
        );
        const data = await response.json();
        setFilteredMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const debounceFetch = setTimeout(fetchMovies, 500); // Debounce to prevent API spam
    return () => clearTimeout(debounceFetch);
  }, [searchTerm, apiKey]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🎬 Movie Radar</Link>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search movies..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn">🔍</button>
      </div>

      {/* Display Search Results in a Horizontal Scrollable List */}
      {filteredMovies.length > 0 && (
        <div className="search-results-container">
          <div className="search-results">
            {filteredMovies.map((movie) => (
              <div
                key={movie.id}
                className="search-result-item"
                onClick={() => {
                  navigate(`/movie/${movie.id}`);
                  setSearchTerm(""); // Clear search after selecting
                  setFilteredMovies([]);
                }}
              >
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="nav-right">
        <Link to="/watchlist" className="nav-item">Watchlist</Link>

        {isLoggedIn ? (
          <div className="profile-dropdown" ref={dropdownRef}>
            <button className="profile-btn" onClick={() => setDropdownOpen((prev) => !prev)}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Profile" className="profile-pic" />
              ) : (
                <div className="default-avatar">🎬</div>
              )}
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">My Profile</Link>
                <button onClick={handleLogout} className="dropdown-item logout-btn">Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-item">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
