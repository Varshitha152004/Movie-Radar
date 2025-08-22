import React, { useState, useEffect } from "react";
import "../styles/WatchlistPage.css";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const apiKey = import.meta.env.VITE_TMDB_API_KEY; // ✅ Get API key from environment variables

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    const fetchMovieDetails = async () => {
      const moviesWithDetails = await Promise.all(
        savedWatchlist.map(async (movie) => {
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`
            );
            if (!response.ok) throw new Error("Failed to fetch movie details");
            const data = await response.json();
            return { ...movie, posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}` };
          } catch {
            return movie; // If API fails, fallback to saved data
          }
        })
      );
      setWatchlist(moviesWithDetails);
    };

    fetchMovieDetails();
  }, []);

  const removeFromWatchlist = (id) => {
    const updatedWatchlist = watchlist.filter((movie) => movie.id !== id);
    setWatchlist(updatedWatchlist);
    localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
  };

  return (
    <div className="watchlist-container">
      <h2>Your Watchlist</h2>
      <div className="movies-row">
        {watchlist.length > 0 ? (
          watchlist.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie.posterUrl} alt={movie.title} className="movie-image" />
              <div className="movie-title">{movie.title}</div>
              <button className="remove-btn" onClick={() => removeFromWatchlist(movie.id)}>
                🗑
              </button>
            </div>
          ))
        ) : (
          <p>No movies in your watchlist</p>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
