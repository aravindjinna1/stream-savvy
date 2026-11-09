import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({
  movie,
  inWatch,
  onToggleWatch,
  showPreview = false,
}) {
  const [showLikeBurst, setShowLikeBurst] = useState(false);
  const burstTimeout = useRef(null);

  useEffect(
    () => () => {
      window.clearTimeout(burstTimeout.current);
    },
    []
  );

  const title =
    movie.title ||
    movie.name ||
    movie.movieTitle ||
    movie.original_title ||
    "Untitled";

  const posterUrl =
    movie.posterUrl ||
    movie.poster ||
    movie.image ||
    movie.poster_path ||
    "";
  const genres = Array.isArray(movie.genres) ? movie.genres : [];
  const cast = typeof movie.actors === "string"
    ? movie.actors.split(",").map((actor) => actor.trim()).filter(Boolean).slice(0, 3)
    : [];
  const runtime = movie.runtime
    ? `${movie.runtime} min`
    : "";
  const languages = movie.languages || movie.language;
  const writers = movie.writers || movie.writer;

  const handleClick = (event) => {
    event.stopPropagation();
    if (typeof onToggleWatch === "function") {
      onToggleWatch(movie);
    }
  };

  const handleDoubleClick = (event) => {
    if (event.target.closest("button")) return;

    if (!inWatch && typeof onToggleWatch === "function") {
      onToggleWatch(movie);
    }

    setShowLikeBurst(true);
    window.clearTimeout(burstTimeout.current);
    burstTimeout.current = window.setTimeout(
      () => setShowLikeBurst(false),
      650
    );
  };

  return (
    <article
      className={`ss-movie-card${showPreview ? " ss-movie-card--preview" : ""}`}
      onDoubleClick={handleDoubleClick}
    >
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={title}
          className="ss-movie-poster"
          loading="lazy"
        />
      ) : (
        <div className="ss-movie-no-poster">No poster</div>
      )}

      {/* Heart / watchlist button */}
      <button
        type="button"
        className={
          "ss-movie-like" + (inWatch ? " ss-movie-like--active" : "")
        }
        onClick={handleClick}
        aria-label={inWatch ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={inWatch}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
      </button>

      {showLikeBurst && (
        <div className="ss-movie-like-burst" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
          </svg>
        </div>
      )}

      {showPreview ? (
        <div className="ss-movie-preview">
          <div className="ss-movie-preview-content">
            <h3 className="ss-movie-title">{title}</h3>
            <p className="ss-movie-preview-meta">
              {[movie.year, runtime, ...genres.slice(0, 2)].filter(Boolean).join(" · ")}
            </p>
            <p className="ss-movie-preview-plot">
              {movie.plot || "Discover more about this movie."}
            </p>
            {(movie.director || writers || cast.length > 0 || languages) && (
              <dl className="ss-movie-preview-credits">
                {movie.director && (
                  <div>
                    <dt>Director</dt>
                    <dd>{movie.director}</dd>
                  </div>
                )}
                {writers && (
                  <div>
                    <dt>Writer</dt>
                    <dd>{Array.isArray(writers) ? writers.join(", ") : writers}</dd>
                  </div>
                )}
                {cast.length > 0 && (
                  <div>
                    <dt>Cast</dt>
                    <dd>{cast.join(", ")}</dd>
                  </div>
                )}
                {languages && (
                  <div>
                    <dt>Languages</dt>
                    <dd>{Array.isArray(languages) ? languages.join(", ") : languages}</dd>
                  </div>
                )}
              </dl>
            )}
            <Link
              className="ss-movie-watch-now"
              to={`/movies/${encodeURIComponent(movie.id)}`}
              onClick={(event) => event.stopPropagation()}
              aria-label={`Watch now: ${title}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m8 5 12 7-12 7V5Z" />
              </svg>
              <span>Watch now</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="ss-movie-bottom">
          <p className="ss-movie-title">{title}</p>
        </div>
      )}
    </article>
  );
}
