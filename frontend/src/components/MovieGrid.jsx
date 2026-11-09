// src/components/MovieGrid.jsx

import MovieCard from "./MovieCard";

export default function MovieGrid({
  movies,
  likedMovieIds = [],
  onToggleLike,
}) {
  if (!movies || movies.length === 0) {
    return (
      <p className="text-center text-slate-400">
        No movies found.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:gap-7 md:gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isLiked={likedMovieIds.includes(movie.id)}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  );
}
