// src/components/MovieList.jsx
import React, { useEffect, useState, useContext } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";
import { toggleWatchlist, getWatchlist } from "../utils/watchlist";
import { AuthContext } from "../context/AuthContext";
import { addToWatchlistServer, removeFromWatchlistServer } from "../services/watchlistApi";


const FALLBACK_MOVIES = [
  { id: 'f1', title: 'Sample Movie A', year: '2023', posterUrl: 'https://via.placeholder.com/200x300?text=Sample+A', genres: ['Drama'] },
  { id: 'f2', title: 'Sample Movie B', year: '2022', posterUrl: 'https://via.placeholder.com/200x300?text=Sample+B', genres: ['Action'] },
];


function MovieList({ searchInputRef = null }) {
  const { auth } = useContext(AuthContext);
  const userKey = auth?.user?.email ?? auth?.user?.id ?? null;

  const [movies, setMovies] = useState([]);
  const [localWatch, setLocalWatch] = useState(() => {
    try {
      return getWatchlist(userKey) || [];
    } catch {
      return [];
    }
  });
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // load movies once
  useEffect(() => {
    let mounted = true;
    axiosInstance
      .get("/movies")
      .then((res) => {
        if (mounted) setMovies(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch movies:", err);
        if (mounted) setMovies([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // wire search input if provided
  useEffect(() => {
    if (!searchInputRef) return;
    const el = searchInputRef.current;
    if (!el) return;
    const handler = (e) => setQuery(e.target.value || "");
    el.addEventListener("input", handler);
    return () => el.removeEventListener("input", handler);
  }, [searchInputRef]);

  useEffect(() => {
    // watch for local storage updates (other components)
    const handler = () => {
      try {
        setLocalWatch(getWatchlist(userKey));
      } catch {
        setLocalWatch([]);
      }
    };
    window.addEventListener("ss_watchlist_updated", handler);
    return () => window.removeEventListener("ss_watchlist_updated", handler);
  }, [userKey]);

  const filtered = movies.filter((m) =>
    (m.title || "").toLowerCase().includes(query.toLowerCase())
  );

  const displayList = (filtered && filtered.length > 0) ? filtered : FALLBACK_MOVIES;

  // toggle: update localStorage and also call server when authenticated
  const handleToggle = async (movie) => {
    try {
      // if authenticated, call server first to keep server state authoritative
      if (auth?.isAuthenticated) {
        const id = String(movie.id);
        const inWatch = (getWatchlist(userKey) || []).includes(id);

        if (inWatch) {
          // remove from server
          try {
            await removeFromWatchlistServer(id);
          } catch (err) {
            console.warn("Failed to remove from server watchlist:", err);
            // continue to update local copy anyway for UX
          }
        } else {
          // add to server
          try {
            await addToWatchlistServer(id);
          } catch (err) {
            console.warn("Failed to add to server watchlist:", err);
            // continue to update local copy anyway for UX
          }
        }
      }

      // Always update local storage copy for immediate UI feedback
      toggleWatchlist(movie, userKey);
      // reload local watch state
      try {
        setLocalWatch(getWatchlist(userKey));
      } catch {
        setLocalWatch([]);
      }
      // broadcast update (toggleWatchlist already dispatches ss_watchlist_updated inside setWatchlist)
      window.dispatchEvent(new CustomEvent('ss_watchlist_updated'));
    } catch (err) {
      console.warn("toggle error:", err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({length:8}).map((_,i) => (
          <div key={i} className="bg-gray-800 p-2 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayList.map((movie) => {
          const inWatch = (localWatch || []).includes(String(movie.id));
          return (
            <article key={movie.id} className="bg-gray-800 rounded overflow-hidden shadow">
              <div className="relative">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover" />
                ) : (
                  <div className="w-full h-64 bg-gray-700" />
                )}
                <div className="absolute inset-0 flex items-end p-3 poster-overlay">
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <span className="bg-black/50 px-2 py-1 rounded text-xs">{movie.year || '—'}</span>
                      <button onClick={() => handleToggle(movie)} className="p-2 bg-black/40 rounded-full hover:scale-105">
                        {inWatch ? <FaHeart className="text-pink-400" /> : <FaRegHeart />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-lg">{movie.title}</h3>
                <div className="text-sm text-gray-400">{(movie.genres || []).join(", ")}</div>
                <div className="mt-3 flex items-center justify-between">
                  <a href={`/movies/${movie.id}`} className="text-sm text-indigo-300 hover:underline">Details</a>
                  <div className="text-sm px-2 py-1 bg-white/5 rounded">{inWatch ? 'Saved' : 'Save'}</div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default MovieList;
