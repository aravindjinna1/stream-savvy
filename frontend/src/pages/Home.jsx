// src/pages/Home.jsx
import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { AuthContext } from "../context/AuthContext";
import {
  fetchWatchlist,
  addToWatchlistServer,
  removeFromWatchlistServer,
} from "../services/watchlistApi";
import MoviePagination from "../components/MoviePagination";
import { Link } from "react-router-dom";
import "./Home.css";

const MOVIES_PER_PAGE = 20;

const featuredMovies = [
  {
    title: "Raya And the Last Dragon",
    description:
      "A quiet coastal town, a long-buried secret, and one storm that changes everything.",
    languages: "Hindi, Tamil, Telugu",
    duration: "2h 18m",
    hero: "Arjun Mehta",
    heroine: "Mira Sen",
    director: "Kabir Rao",
    video: "/media/384550.mp4",
    url:"https://www.hotstar.com/in/movies/raya-and-the-last-dragon/1260062999?search_query=The+Last+Monsoon"
  },
  {
    title: "The Fast and the Furious",
    description:
      "Two strangers take the scenic route and discover a place to call home.",
    languages: "English, Hindi",
    duration: "1h 52m",
    hero: "Dev Khanna",
    heroine: "Anaya Das",
    director: "Rhea Kapoor",
    video: "/media/100223-video-720.mp4",
    url:"https://www.primevideo.com/detail/0MF1HUOLIR1XJ3530GG3SE7OZB?ref_=atv_sr_fle_c_sr39f3e4_pvsearchresults_1_2"
  },
  {
    title: "Broklyn Nine-Nine: The Movie",
    description:
      "A fresh start, an unexpected friendship, and a story worth staying for.",
    languages: "Hindi, Malayalam",
    duration: "2h 06m",
    hero: "Ishaan Verma",
    heroine: "Tara Nair",
    director: "Neel Joshi",
    video: "/media/101732-video-720.mp4",
    url:"https://www.hotstar.com/in/shows/brooklyn-nine-nine/1271547857?search_query=friends"
  },
  {
    title: "Always Home",
    description:
      "One winding road leads a restless traveler toward an unexpected reunion.",
    languages: "English, Hindi, Kannada",
    duration: "1h 47m",
    hero: "Rohan Malhotra",
    heroine: "Sana Iyer",
    director: "Aarav Menon",
    video:
      "/media/mixkit-going-down-a-curved-highway-through-a-mountain-range-41576-hd-ready.mp4",

    url:"https://www.primevideo.com/detail/0LQOB0WJRKOU0KT9HAK2M3VL6U?ref_=atv_sr_fle_c_sr39f3e4_pvsearchresults_2_1",
  },
  {
    title: "Salmokji: Whispering Water",
    description:
      "A photographer finds a hidden forest and a reason to see the world differently.",
    languages: "Hindi, Bengali",
    duration: "1h 39m",
    hero: "Karan Suri",
    heroine: "Ira Bose",
    director: "Nisha Rao",
    video: "/media/mixkit-waterfall-in-forest-2213-hd-ready.mp4",
    url:"https://www.primevideo.com/detail/0UA2KJIQSXOU6FZJMN82U8JRT2?ref_=atv_sr_fle_c_sr782405_pvsearchresults_1_1",
  },
];

export default function Home() {
  const { auth } = useContext(AuthContext);
  const userId = auth?.user?.id;

  const [movies, setMovies] = useState([]);
  const [watchIds, setWatchIds] = useState([]); // array of movieId
  const [loading, setLoading] = useState(true);
  const [moviePage, setMoviePage] = useState(1);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const featuredMovie = featuredMovies[featuredIndex];
  const visibleMovies = movies.slice(
    (moviePage - 1) * MOVIES_PER_PAGE,
    moviePage * MOVIES_PER_PAGE
  );

  // Load the full catalog so home pagination can reach every movie.
  useEffect(() => {
    let mounted = true;
    axiosInstance
      .get("/movies")
      .then((res) => {
        if (mounted) setMovies(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        if (mounted) setMovies([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // load watchlist from server when logged in
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

  // handle heart click
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

      // update local state
      setWatchIds((prev) =>
        prev.includes(movieId)
          ? prev.filter((id) => id !== movieId)
          : [...prev, movieId]
      );
      

    } catch (err) {
      console.error("Failed to toggle watchlist:", err);
    }
  };

  
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* <header className="home-hero">
          <span className="home-hero-eyebrow">YOUR NEXT MOVIE NIGHT STARTS HERE</span>
          <h1 className="home-hero-title">
            Discover movies <span>you&apos;ll love</span>
          </h1>
          <p className="home-hero-description">
            Explore a curated catalog of movies. Save favourites and build your
            watchlist.
          </p>
        </header> */}

        <section className="home-featured" aria-label="Featured movies and sports">
          <section className="home-feature-player" aria-label="Featured movie">
           
            <video
              key={featuredMovie.video}
              className="home-feature-video"
              src={featuredMovie.video}
              autoPlay
              muted={isMuted}
              playsInline
              preload="metadata"
              onEnded={() =>
                setFeaturedIndex((index) => (index + 1) % featuredMovies.length)
              }
              onError={(event) =>
                console.error("Featured video could not be loaded:", event.currentTarget.error)
              }
              aria-label={`Preview for ${featuredMovie.title}`}
            />
            <div className="home-feature-shade" />

            <div className="home-feature-content">
              <span className="home-feature-eyebrow">FEATURED MOVIE</span>
              <h2>{featuredMovie.title}</h2>
              <p className="home-feature-description">{featuredMovie.description}</p>
              <p className="home-feature-meta">
                <span>{featuredMovie.languages}</span>
                <span>{featuredMovie.duration}</span>
              </p>
              <p className="home-feature-credits">
                <span>★ {featuredMovie.hero}</span>
                <span>{featuredMovie.heroine}</span>
                <span>Director: {featuredMovie.director}</span>
              </p>
              <Link className="home-subscribe-button" to={featuredMovie.url} target="_blank" rel="noopener noreferrer">
                Subscribe to watch
              </Link>
            </div>

            <button
              className="home-feature-mute"
              type="button"
              onClick={() => setIsMuted((muted) => !muted)}
              aria-label={isMuted ? "Unmute preview" : "Mute preview"}
            >
              {isMuted ? "Unmute" : "Mute"}
            </button>

            <div className="home-feature-controls">
              <button
                className="home-feature-arrow"
                type="button"
                onClick={() =>
                  setFeaturedIndex(
                    (index) => (index - 1 + featuredMovies.length) % featuredMovies.length
                  )
                }
                aria-label="Previous featured movie"
              >
                &#8249;
              </button>
              <span className="home-feature-count" aria-live="polite">
                {String(featuredIndex + 1).padStart(2, "0")} /{" "}
                {String(featuredMovies.length).padStart(2, "0")}
              </span>
              <button
                className="home-feature-arrow"
                type="button"
                onClick={() =>
                  setFeaturedIndex((index) => (index + 1) % featuredMovies.length)
                }
                aria-label="Next featured movie"
              >
                &#8250;
              </button>
            </div>
          </section>

          <section className="home-match-list" aria-label="Upcoming sports streams">
            
            <article className="home-match-banner">
              <a className="match-links" href="https://www.hotstar.com/in/sports/cricket/india-storm-past-nz-for-historic-crown/1271548320/watch?search_query=Ind+vs+nz" target="_blank" rel="noopener noreferrer">
                <img
                  className="home-match-image"
                  src="/media/india-cricket-team.png"
                  alt="Indian cricket team celebrating together"
                />
              
              <div className="home-match-copy">
                <span className="home-match-eyebrow">TODAY · 4:30 PM</span>
                <h2>India vs New Zealand</h2>
                <p>Cricket · Upcoming stream</p>
              </div>
              <span className="home-match-live">UP NEXT</span>

              </a>
            </article>

            <article className="home-match-banner">

              <a className="match-links" href="https://www.hotstar.com/in/sports/football/mw-13-everton-1-4-newcastle-united/1540056927/video/highlights/watch?search_query=Newcastle+United+and+Everton+football+match" target="_blank" rel="noopener noreferrer">
              <img
                className="home-match-image"
                src="https://i2-prod.walesonline.co.uk/article34446912.ece/ALTERNATES/s1200f/0_JS398309666.jpg"
                alt="Newcastle United and Everton football match"
                loading="lazy"
              />
              <div className="home-match-copy">
                <span className="home-match-eyebrow">TOMORROW · 1:30 PM</span>
                <h2>Newcastle United vs Everton</h2>
                <p>Football · Murrayfield</p>
              </div>
              <span className="home-match-live">UP NEXT</span>
              </a>
            </article>
          </section>
        </section>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-800 rounded animate-pulse"
              />
            ))}
          </div>
        ) : (
          <section>
            <h2 className="text-2xl font-semibold mb-4 ml-[20px]">Popular movies</h2>
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
              totalItems={movies.length}
              onPageChange={setMoviePage}
            />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
