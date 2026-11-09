// src/services/watchlistApi.js
import axiosInstance from "../utils/axiosInstance";

/**
 * Get all watchlist entries for a user, with movie expanded.
 * Requires db.json to have:
 * "watchlist": [ { "id": 1, "userId": 1, "movieId": 2 } ]
 */
export const fetchWatchlist = async (userId) => {
  if (!userId) return [];
  const res = await axiosInstance.get(
    `/watchlist?userId=${userId}&_expand=movie`
  );
  return res.data || [];
};

/**
 * Add a movie to the user's watchlist on JSON Server.
 */
export const addToWatchlistServer = async (userId, movieId) => {
  if (!userId || !movieId) return null;

  // avoid duplicates: check if already exists
  const existing = await axiosInstance.get(
    `/watchlist?userId=${userId}&movieId=${movieId}`
  );
  if (existing.data && existing.data.length > 0) {
    return existing.data[0];
  }

  const res = await axiosInstance.post("/watchlist", {
    userId,
    movieId,
  });
  return res.data;
};

/**
 * Remove a movie from the user's watchlist by movieId.
 * It finds the watchlist entry for (userId, movieId), then deletes it.
 */
export const removeFromWatchlistServer = async (userId, movieId) => {
  if (!userId || !movieId) return null;

  const existing = await axiosInstance.get(
    `/watchlist?userId=${userId}&movieId=${movieId}`
  );
  if (!existing.data || existing.data.length === 0) return null;

  const entry = existing.data[0];
  await axiosInstance.delete(`/watchlist/${entry.id}`);
  return true;
};
