import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="ss-footer">
      <div className="ss-footer-content">
        <div className="ss-footer-brand">
          <span className="ss-footer-logo">StreamSavvy</span>
          <p>Find your next favorite movie.</p>
        </div>
        <p className="ss-footer-meta">
          © {new Date().getFullYear()} StreamSavvy
          <span className="ss-footer-divider" aria-hidden="true">·</span>
          Built for demo &amp; learning
        </p>
      </div>
    </footer>
  );
}
