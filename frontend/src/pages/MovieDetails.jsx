// src/pages/MovieDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { getWatchlist, toggleWatchlist } from "../utils/watchlist";
import {
  addToWatchlistServer,
  removeFromWatchlistServer,
} from "../services/watchlistApi";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const userKey = auth?.user?.email ?? auth?.user?.id ?? null;

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localWatch, setLocalWatch] = useState(
    () => getWatchlist(userKey) || []
  );

  // Load single movie by ID
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        if (!id) return;
        // JSON-Server supports /movies/:id by default
        const res = await axiosInstance.get(`/movies/${encodeURIComponent(id)}`);
        if (cancelled) return;
        setMovie(res.data || null);
      } catch (err) {
        console.error("Failed to load movie details:", err);
        if (!cancelled) setMovie(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Sync watchlist from localStorage
  useEffect(() => {
    const handler = () => setLocalWatch(getWatchlist(userKey) || []);
    window.addEventListener("ss_watchlist_updated", handler);
    return () => window.removeEventListener("ss_watchlist_updated", handler);
  }, [userKey]);

  const inWatch = movie
    ? (localWatch || []).includes(String(movie.id))
    : false;

  const handleHeart = async () => {
    if (!movie) return;

    // same rule as other pages
    if (!auth?.isAuthenticated) {
      alert("Please log in to add movies to your watchlist.");
      return;
    }

    const mid = String(movie.id);

    try {
      if (inWatch) {
        await removeFromWatchlistServer(mid);
      } else {
        await addToWatchlistServer(mid);
      }
    } catch (err) {
      console.warn("Watchlist server call failed:", err);
    }

    toggleWatchlist(movie, userKey);
    setLocalWatch(getWatchlist(userKey) || []);
    window.dispatchEvent(new CustomEvent("ss_watchlist_updated"));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-10 w-full">
          Loading...
        </main>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 py-10 w-full">
          Movie not available.
        </main>
        <Footer />
      </div>
    );
  }

  const rating = movie.imdbRating || movie.rating || "N/A";
  const year = movie.year || "—";
  const runtime = movie.runtime ? `${movie.runtime} min` : "—";
  const genres = (movie.genres || []).join(", ");

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Poster */}
          <div className="flex-shrink-0 flex justify-center md:justify-start">
            <div className="w-[220px]">
              <div className="ss-movie-card">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="ss-movie-poster"
                  />
                ) : (
                  <div className="ss-movie-no-poster">No poster</div>
                )}

                <button
                  type="button"
                  className={
                    "ss-movie-like" +
                    (inWatch ? " ss-movie-like--active" : "")
                  }
                  onClick={handleHeart}
                  aria-label={inWatch ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={inWatch}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
                  </svg>
                </button>

                <div className="ss-movie-bottom">
                  <p className="ss-movie-title">{movie.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <section className="flex-1 text-gray-200">
            <header className="flex flex-col gap-2 mb-4">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {movie.title}{" "}
                  <span className="text-gray-400 text-lg">
                    ({year})
                  </span>
                </h1>
                <div className="text-sm md:text-base text-yellow-300 font-semibold whitespace-nowrap">
                  {rating}/10
                </div>
              </div>

              <div className="text-sm flex flex-wrap items-center gap-2">
                {runtime && (
                  <span className="font-semibold text-gray-300">
                    {runtime}
                  </span>
                )}
                {genres && (
                  <span className="text-gray-400">• {genres}</span>
                )}
              </div>
            </header>

            <p className="text-sm md:text-base text-gray-100 leading-relaxed mb-6">
              {movie.plot || "No plot available."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {movie.director && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    Director
                  </div>
                  <div className="mt-1 text-sm">{movie.director}</div>
                </div>
              )}
              {movie.actors && (
                <div>
                  <div className="text-xs uppercase tracking-wide text-gray-400">
                    Actors
                  </div>
                  <div className="mt-1 text-sm">{movie.actors}</div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => navigate("/movies")}
                className="text-sm px-4 py-2 rounded-full border border-gray-600 bg-gray-800 hover:bg-gray-700 transition"
              >
                ← Back to list
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
