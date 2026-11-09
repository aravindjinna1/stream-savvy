// src/pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import "./Profile.css";

export default function Profile() {
  const { auth } = useContext(AuthContext);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load watchlist movies from JSON Server
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // 1) get ALL watchlist entries
        const wlRes = await axiosInstance.get("/watchlist");
        const entries = wlRes.data || [];

        if (!entries.length) {
          if (mounted) setMovies([]);
          return;
        }

        // 2) collect UNIQUE movie IDs (avoid duplicates)
        const uniqueIds = [...new Set(entries.map((e) => e.movieId))];

        // 3) build query: /movies?id=7&id=10&id=11
        const query = uniqueIds
          .map((id) => `id=${encodeURIComponent(id)}`)
          .join("&");

        // 4) fetch those movies in one request
        const mRes = await axiosInstance.get(`/movies?${query}`);

        if (mounted) {
          setMovies(mRes.data || []);
        }
      } catch (err) {
        console.error("Failed to load profile watchlist", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []); // no auth dependency – purely based on db.json

  // 🔹 Remove a movie from watchlist (db.json + UI)
  const handleRemove = async (movieId) => {
    try {
      // find all watchlist entries with this movieId
      const wlRes = await axiosInstance.get(`/watchlist?movieId=${movieId}`);
      const items = wlRes.data || [];

      // delete each entry
      await Promise.all(
        items.map((item) => axiosInstance.delete(`/watchlist/${item.id}`))
      );

      // update UI
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
    } catch (err) {
      console.error("Failed to remove from watchlist", err);
    }
  };

  // display info for header card
  const displayName =
    auth?.user?.name || auth?.user?.email || "User";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        {/* Header / User info */}
        <section className="profile-header">
          <div>
            <h1 className="profile-title">Profile</h1>
            <p className="profile-subtitle">
              View your account and manage your watchlist.
            </p>
          </div>

          <div className="profile-user-card">
            <div className="profile-avatar">{avatarLetter}</div>
            <div className="profile-user-info">
              <div className="profile-user-name">
                {auth?.user?.name || "Unnamed user"}
              </div>
              <div className="profile-user-email">{auth?.user?.email}</div>
            </div>
          </div>
        </section>

        {/* Watchlist section */}
        <section className="profile-watchlist">
          <h2 className="profile-section-title">Your Watchlist</h2>

          {loading ? (
            <div className="profile-empty">Loading...</div>
          ) : movies.length === 0 ? (
            <div className="profile-empty">
              No movies in your watchlist yet.
            </div>
          ) : (
            <div className="profile-grid">
              {movies.map((m) => (
                <div key={m.id} className="profile-movie-card">
                  {/* consistent card design */}
                  <MovieCard
                    movie={m}
                    inWatch={true}
                    onToggleWatch={() => handleRemove(m.id)}
                  />

                  <div className="profile-movie-actions">
                    <button
                      type="button"
                      className="profile-btn profile-btn--danger"
                      onClick={() => handleRemove(m.id)}
                    >
                      Remove
                    </button>
                    <Link
                      to={`/movies/${m.id}`}
                      className="profile-btn profile-btn--outline"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
