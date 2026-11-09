// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { name, email, password } = formData;

    try {
      const res = await registerUser(name, email, password);
      setLoading(false);

      if (!res.ok) {
        setError(res.error || "Registration failed");
        return;
      }

      navigate("/", { replace: true });
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setLoading(false);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="login-page">
      <Navbar />

      {/* SPLIT LAYOUT: left = form, right = image */}
      <main className="login-main" aria-labelledby="register-heading">
        <section className="login-left" role="region" aria-describedby="register-desc">
          <div className="login-card">
            <h2 id="register-heading" className="login-title">Create Account</h2>
            <p id="register-desc" className="login-subtitle">Join StreamSavvy and start watching!</p>

            {error && <div className="login-error">{error}</div>}

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="login-field">
                <label className="login-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="login-input"
                />
              </div>

              {/* Email */}
              <div className="login-field">
                <label className="login-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="login-input"
                />
              </div>

              {/* Password */}
              <div className="login-field">
                <label className="login-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="login-input"
                />
              </div>

              {/* Register button */}
              <button
                type="submit"
                disabled={loading}
                className="login-button"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              <p className="login-footer-text">
                Already have an account?{" "}
                <Link to="/login" className="login-footer-link">
                  Log in
                </Link>
              </p>
            </form>
          </div>
        </section>

        <aside
          className="login-right"
          aria-hidden="true"
        >
          <div className="login-image-copy">
            <p className="login-image-eyebrow">STREAMSAVVY</p>
            <h2>Stories worth staying in for.</h2>
            <p>Create your account and find your next favorite.</p>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
