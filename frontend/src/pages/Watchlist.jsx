// src/pages/Watchlist.jsx
import React, { useEffect, useState } from "react";
import { getWatchlist, removeFromWatchlist } from "../utils/watchlist";

export default function WatchlistPage() {
  const [items, setItems] = useState(getWatchlist());

  useEffect(() => {
    const onStorage = () => setItems(getWatchlist());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleRemove = (id) => {
    removeFromWatchlist(id);
    setItems(getWatchlist());
  };

  if (items.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-semibold">Your Watchlist</h2>
        <div className="mt-4 text-gray-400">No items yet. Add movies from the Movies page.</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Your Watchlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((m) => (
          <div key={m.id} className="bg-gray-800 rounded overflow-hidden">
            {m.poster ? (
              <img src={m.poster} alt={m.title} className="w-full h-44 object-cover" />
            ) : (
              <div style={{ height: 176 }} className="bg-gray-700" />
            )}
            <div className="p-3">
              <div className="font-semibold">{m.title}</div>
              <div className="text-sm text-gray-400">{(m.genres || []).join(", ")}</div>
              <div className="mt-2 flex items-center gap-2">
                <button onClick={() => handleRemove(m.id)} className="px-3 py-1 bg-red-600 rounded">
                  Remove
                </button>
                <a href={`/movies/${m.id}`} className="text-sm underline">
                  Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
