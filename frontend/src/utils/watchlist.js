// src/utils/watchlist.js
// simple local watchlist utilities (localStorage-based)
// keys: 'ss_watchlist' (global) or 'ss_watchlist::user@example.com'

export function getWatchlist(userKey) {
  try {
    const key = userKey ? `ss_watchlist::${userKey}` : 'ss_watchlist';
    return JSON.parse(localStorage.getItem(key) || "[]").map(String);
  } catch (err) {
    console.warn(err);
    return [];
  }
}

export function setWatchlist(ids, userKey) {
  try {
    const key = userKey ? `ss_watchlist::${userKey}` : 'ss_watchlist';
    localStorage.setItem(key, JSON.stringify(Array.from(new Set(ids.map(String)))));
    window.dispatchEvent(new CustomEvent('ss_watchlist_updated'));
  } catch (err) {
    console.warn(err);
  }
}

export function toggleWatchlist(movie, userKey) {
  try {
    const ids = getWatchlist(userKey);
    const id = String(movie.id);
    if (ids.includes(id)) {
      const next = ids.filter(x => x !== id);
      setWatchlist(next, userKey);
    } else {
      ids.push(id);
      setWatchlist(ids, userKey);
    }
  } catch (err) {
    console.warn(err);
  }
}

export function removeFromWatchlist(id, userKey) {
  try {
    const ids = getWatchlist(userKey);
    setWatchlist(ids.filter(x => String(x) !== String(id)), userKey);
    window.dispatchEvent(new CustomEvent('ss_watchlist_updated'));
  } catch (err) {
    console.warn(err);
  }
}
