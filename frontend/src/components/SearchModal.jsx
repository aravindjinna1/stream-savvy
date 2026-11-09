// src/components/SearchModal.jsx
import React, { useRef, useEffect } from "react";

const SearchModal = ({ open = false, onClose = () => {}, onPick = () => {} }) => {
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center p-4 z-50 mt-20">
      <div ref={ref} className="bg-gradient-to-br from-gray-900 to-black p-4 rounded w-full max-w-2xl shadow-2xl">
        <div className="flex gap-2 items-center">
          <input placeholder="Search movies by title..." className="flex-1 p-3 rounded bg-gray-800 border border-white/5 placeholder-gray-500 text-white" />
          <button onClick={() => { onPick(); onClose(); }} className="px-4 py-2 bg-indigo-600 rounded">Search</button>
          <button onClick={onClose} className="px-3 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
