import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser, user } = useContext(AuthContext) || {};

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email";
    if (!formData.password) errs.password = "Password is required";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await loginUser(formData.email, formData.password, { remember });
      setLoading(false);

      if (res && res.ok) {
        navigate("/", { replace: true });
      } else {
        setError((res && res.error) || "Login failed. Please check your credentials or try again.");
      }
    } catch (err) {
      setLoading(false);
      setError(err?.message || "Network error. Please try again later.");
    }
  };

  
  return (
    <div className="login-page">
      <Navbar />

      {/* SPLIT LAYOUT: left = form, right = image */}
      <main className="login-main" aria-labelledby="login-heading">
        <section className="login-left" role="region" aria-describedby="login-desc">
          <div className="login-card">
            <h2 id="login-heading" className="login-title">Login</h2>
            <p id="login-desc" className="login-subtitle">Sign in with your account to continue.</p>

            {error && <div className="login-error" role="alert">{error}</div>}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor="email" className="login-label">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  className={`login-input ${fieldErrors.email ? "login-input-error" : ""}`}
                />
                {fieldErrors.email && <div id="email-error" className="login-field-error">{fieldErrors.email}</div>}
              </div>

              <div className="login-field">
                <label htmlFor="password" className="login-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
                  className={`login-input ${fieldErrors.password ? "login-input-error" : ""}`}
                />
                {fieldErrors.password && <div id="password-error" className="login-field-error">{fieldErrors.password}</div>}
              </div>

              <div className="login-row">
                <label className="login-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={() => setRemember((r) => !r)}
                    aria-checked={remember}
                  />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot" className="login-link-button">Forgot?</Link>
              </div>

              <button type="submit" disabled={loading} className="login-button">
                {loading ? "Signing in..." : "Login"}
              </button>

              <p className="login-footer-text">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="login-footer-link">Register</Link>
              </p>
            </form>
          </div>
        </section>

        {/* right side: image panel */}
        <aside
          className="login-right"
          aria-hidden="true"
        >
          <div className="login-image-copy">
            <p className="login-image-eyebrow">STREAMSAVVY</p>
            <h2>Stories worth staying in for.</h2>
            <p>Find your next favorite and make tonight a movie night.</p>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
