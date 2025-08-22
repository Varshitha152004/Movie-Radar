import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/CategoryPage.css";

const CategoryPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMoviesByCategory();
  }, [category]);

  const fetchMoviesByCategory = async () => {
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const genreId = getGenreId(category);

      if (!genreId) {
        console.error("Invalid category:", category);
        return;
      }

      let allMovies = [];
      let page = 1;

      while (allMovies.length < 100) {
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=hi-IN&sort_by=popularity.desc&with_genres=${genreId}&with_original_language=hi|te|ta|ml|kn|bn&page=${page}&region=IN`
        );
        const data = await response.json();

        if (!data.results || data.results.length === 0) break;

        allMovies = [...allMovies, ...data.results];
        page++;
      }

      // Slice movies to 100 max
      allMovies = allMovies.slice(0, 100);

      // Translate movie titles
      const translatedMovies = await Promise.all(
        allMovies.map(async (movie) => {
          const translatedTitle = await fetchTranslatedTitle(movie.id, apiKey);
          return { ...movie, title: translatedTitle || movie.original_title };
        })
      );

      setMovies(translatedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchTranslatedTitle = async (movieId, apiKey) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/translations?api_key=${apiKey}`
      );
      const data = await response.json();

      const englishTranslation = data?.translations?.find(
        (t) => t.iso_639_1 === "en"
      );

      return englishTranslation?.data?.title || null;
    } catch (error) {
      console.error("Error fetching translation:", error);
      return null;
    }
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
    <div className="category-page">
      <h2>{category.toUpperCase()} Movies</h2>
      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
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
          ))
        ) : (
          <p>No movies found for this category.</p>
        )}
      </div>
    </div>
  );
};

// Mapping category (emotion) to genre IDs
const getGenreId = (category) => {
  const genreMap = {
    action: 28,
    comedy: 35,
    drama: 18,
    horror: 27,
    "sci-fi": 878,
    romance: 10749,
    happy: 35, // Comedy makes people happy
    sad: 18, // Drama is emotional/sad
    excited: 28, // Action is thrilling
    scared: 27, // Horror for scared mood
    romantic: 10749, // Romance for love mood
  };
  return genreMap[category.toLowerCase()] || null;
};

export default CategoryPage;
