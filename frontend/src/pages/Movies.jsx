// src/pages/Movies.jsx
import React, { useEffect, useState, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import SearchFilterBar from "../components/SearchFilterBar";
import {
  fetchWatchlist,
  addToWatchlistServer,
  removeFromWatchlistServer,
} from "../services/watchlistApi";
import MoviePagination from "../components/MoviePagination";

const MOVIES_PER_PAGE = 20;

export default function Movies() {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id;

  const [movies, setMovies] = useState([]);
  const [watchIds, setWatchIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moviePage, setMoviePage] = useState(1);

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // load all movies
  useEffect(() => {
    let mounted = true;

    axiosInstance
      .get("/movies")
      .then((res) => mounted && setMovies(res.data || []))
      .catch(() => mounted && setMovies([]))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // load watchlist when logged in
  useEffect(() => {
    let mounted = true;

    async function loadWatchlist() {
      if (!auth?.isAuthenticated || !userId) {
        setWatchIds([]);
        return;
      }
      try {
        const entries = await fetchWatchlist(userId);
        if (mounted) {
          const ids = entries.map((e) => e.movieId);
          setWatchIds(ids);
        }
      } catch (err) {
        console.error("Failed to load watchlist", err);
      }
    }

    loadWatchlist();
    return () => {
      mounted = false;
    };
  }, [auth?.isAuthenticated, userId]);

  // CLICK heart handler
  const handleToggle = async (movie) => {
    if (!auth?.isAuthenticated || !userId) {
      alert("Please log in to add movies to your watchlist.");
      return;
    }

    const movieId = movie.id;
    const isIn = watchIds.includes(movieId);

    try {
      if (isIn) {
        await removeFromWatchlistServer(userId, movieId);
      } else {
        await addToWatchlistServer(userId, movieId);
      }

      setWatchIds((prev) =>
        prev.includes(movieId)
          ? prev.filter((id) => id !== movieId)
          : [...prev, movieId]
      );
    } catch (err) {
      console.warn("Failed to toggle watchlist:", err);
    }
  };

  // build filters
  const genres = [
    ...new Set(
      movies.flatMap((m) =>
        Array.isArray(m.genres) ? m.genres : []
      )
    ),
  ];

  const years = [...new Set(movies.map((m) => m.year))]
    .filter(Boolean)
    .sort()
    .reverse();

  const filteredMovies = movies.filter((m) => {
    const matchSearch = m.title
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchGenre = selectedGenre
      ? m.genres?.includes(selectedGenre)
      : true;
    const matchYear = selectedYear ? m.year === selectedYear : true;
    return matchSearch && matchGenre && matchYear;
  });
  const visibleMovies = filteredMovies.slice(
    (moviePage - 1) * MOVIES_PER_PAGE,
    moviePage * MOVIES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-10 w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">All Movies</h1>
          <p className="mt-2 text-gray-400">
            Browse the complete catalog and build your watchlist.
          </p>
        </header>

        <SearchFilterBar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setMoviePage(1);
          }}
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreChange={(value) => {
            setSelectedGenre(value);
            setMoviePage(1);
          }}
          years={years}
          selectedYear={selectedYear}
          onYearChange={(value) => {
            setSelectedYear(value);
            setMoviePage(1);
          }}
        />

        <section className="mt-12">
          {loading ? (
            <div className="ss-movie-grid">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="ss-movie-grid-item">
                  <div className="ss-movie-card ss-movie-card--skeleton" />
                </div>
              ))}
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center text-gray-400 py-16">
              No movies found matching your filters.
            </div>
          ) : (
            <>
              <div className="ss-movie-grid">
                {visibleMovies.map((m) => (
                  <div key={m.id} className="ss-movie-grid-item">
                    <MovieCard
                      movie={m}
                      inWatch={watchIds.includes(m.id)}
                      onToggleWatch={() => handleToggle(m)}
                      showPreview
                    />
                  </div>
                ))}
              </div>
              <MoviePagination
                page={moviePage}
                pageSize={MOVIES_PER_PAGE}
                totalItems={filteredMovies.length}
                onPageChange={setMoviePage}
              />
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
