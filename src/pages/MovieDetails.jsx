import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/MovieDetails.css";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        );
        if (!response.ok) throw new Error("Failed to fetch movie details");
        const data = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <div>Loading movie details...</div>;
  if (error) return <div>Error: {error}</div>;

  // Streaming platforms
  const streamingPlatforms = [
    {
      name: "Netflix",
      url: `https://www.netflix.com/search?q=${encodeURIComponent(movie.title)}`,
      logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    },
    {
      name: "Prime Video",
      url: `https://www.primevideo.com/search/ref=atv_sr_sug?ie=UTF8&phrase=${encodeURIComponent(movie.title)}`,
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
    },
    {
      name: "Disney+ Hotstar",
      url: `https://www.hotstar.com/in/search?q=${encodeURIComponent(movie.title)}`,
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg",
    },
    {
      name: "YouTube",
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title)} full movie`,
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
    },
  ];

  return (
    <div className="movie-details-container">
      <div className="movie-content">
        {/* Movie Poster */}
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="movie-poster"
        />

        <div className="movie-info">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="rating-badge">⭐ {movie.vote_average}</span>
            <span>{movie.genres.map((g) => g.name).join(", ")}</span>
            <span>{movie.release_date}</span>
          </div>
          <p className="movie-description">{movie.overview}</p>

          {/* Watch Now Section */}
          <div className="watch-now">
            <strong>Watch Now On:</strong>
            <div className="platform-buttons">
              {streamingPlatforms.map((platform) => (
                <button
                  key={platform.name}
                  className="platform-btn"
                  onClick={() => window.open(platform.url, "_blank")}
                >
                  <img src={platform.logo} alt={platform.name} className="platform-logo" />
                </button>
              ))}
            </div>
          </div>

          {/* Watch Trailer Button */}
          <button
            className="watch-trailer-btn"
            onClick={() =>
              window.open(
                `https://www.youtube.com/results?search_query=${movie.title} trailer`,
                "_blank"
              )
            }
          >
            Watch Trailer
          </button>

          {/* Comments Section */}
          <div className="comments-section">
            <h3>Comments</h3>
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <textarea
              rows="3"
              placeholder="Your Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button onClick={() => alert(`Comment added by ${userName}`)}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
