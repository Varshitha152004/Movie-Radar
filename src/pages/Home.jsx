import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const emotions = [
  "Happy", "Sad", "Excited", "Scared", "Romantic", "Action", "Comedy", "Drama", "Horror", "Sci-Fi"
];
const categories = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance"];

const genreMap = {
  Action: 28, Comedy: 35, Drama: 18, Horror: 27, "Sci-Fi": 878, Romance: 10749,
  Happy: 35, Sad: 18, Excited: 28, Scared: 27, Romantic: 10749
};

const Home = () => {
  const navigate = useNavigate();
  const [moviesByCategory, setMoviesByCategory] = useState({});

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isLoggedIn");
    if (!isAuthenticated || isAuthenticated !== "true") {
      navigate("/login");
    } else {
      fetchAllCategories();
    }
  }, [navigate]);

  // Fetch famous Indian movies for all categories
  const fetchAllCategories = async () => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    const categoryMovies = {};
    const indianLanguages = ["hi", "ta", "te", "ml", "kn"]; // Hindi, Tamil, Telugu, Malayalam, Kannada

    await Promise.all(
      categories.map(async (category) => {
        const genreId = genreMap[category];
        if (genreId) {
          try {
            const promises = indianLanguages.map(async (lang) => {
              const response = await fetch(
                `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&with_original_language=${lang}`
              );
              const data = await response.json();
              return data.results || [];
            });

            const results = await Promise.all(promises);
            categoryMovies[category] = results.flat(); // Merge movies from all languages
          } catch (error) {
            console.error(`Error fetching ${category} Indian movies:`, error);
          }
        }
      })
    );

    setMoviesByCategory(categoryMovies);
  };

  // Add movie to Watchlist
  const addToWatchlist = (movie) => {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    if (!watchlist.some((m) => m.id === movie.id)) {
      watchlist.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
    }
  };

  return (
    <div className="home-container">
      {/* Emotion-Based Selection */}
      <div className="emotion-container">
        <h3>Choose by Emotion</h3>
        <div className="emotion-buttons">
          {emotions.map((emotion) => (
            <button 
              key={emotion} 
              className="emotion-btn" 
              onClick={() => navigate(`/category/${encodeURIComponent(emotion.toLowerCase())}`)}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      {/* Movie Categories */}
      <div className="movie-section">
        {categories.map((category) => {
          const movies = moviesByCategory[category] || [];

          return (
            <div key={category} className="category">
              <div className="category-header">
                <h2>{category} Movie</h2> {/* Updated text format */}
                {movies.length > 6 && (
                  <button 
                    className="see-all" 
                    onClick={() => navigate(`/category/${encodeURIComponent(category.toLowerCase())}`)}
                  >
                    See All
                  </button>
                )}
              </div>
              <div className="movies-row">
                {movies.slice(0, 6).map((movie) => (
                  <div 
                    key={movie.id} 
                    className="movie-card" 
                    onClick={() => navigate(`/movie/${movie.id}`)}
                  >
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title} 
                      className="movie-image" 
                    />
                    <div className="movie-title">{movie.title}</div>
                    {/* Add to Watchlist Button */}
                    <button
                      className="add-to-watchlist"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWatchlist(movie);
                      }}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
