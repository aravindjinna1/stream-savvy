import React from "react";
import "./SearchFilterBar.css";

export default function SearchFilterBar({
  search,
  onSearchChange,
  genres,
  selectedGenre,
  onGenreChange,
  years,
  selectedYear,
  onYearChange,
}) {
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  const handleResetSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="ss-filter-bar mb-[40px]">
      {/* Fancy search input */}
      <form
        className="ss-search-form"
        onSubmit={(e) => e.preventDefault()}
      >
        <button className="ss-search-icon" type="submit">
          <svg
            width={17}
            height={16}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <path
              d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
              stroke="currentColor"
              strokeWidth="1.333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <input
          className="ss-search-input"
          placeholder="Search movies..."
          type="text"
          value={search}
          onChange={handleSearchChange}
        />

        <button
          className="ss-search-reset"
          type="button"
          onClick={handleResetSearch}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ss-reset-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </form>

      {/* Filters */}
      <div className="ss-filter-selects">
        <div className="ss-select-wrapper">
          <select
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="ss-select-wrapper">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
