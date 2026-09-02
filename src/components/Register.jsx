import { useState } from "react";
import { Sparkles, TrendingUp, ShieldCheck, PieChart, ArrowRight } from "lucide-react";
import api from "../api";
import "../styles/auth.css";

function Register({ onRegister, onBackToLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/register/", {
        username,
        password,
      });

      onRegister();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Failed to create account. Username may already be taken.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Open Background Hero Showcase */}
        <div className="auth-hero-section">
          <div className="auth-brand-badge">
            <div className="auth-brand-logo-glow" />
            <div className="auth-brand-logo">
              <Sparkles size={20} className="auth-brand-icon" />
            </div>
            <span className="auth-brand-name">Expense Tracker</span>
            <span className="auth-brand-tag">SPENDING HUB</span>
          </div>

          <h1 className="auth-hero-title">
            Take complete control of <br className="hidden-mobile" />
            <span className="gradient-text">your personal spending.</span>
          </h1>

          <p className="auth-hero-desc">
            Track daily expenses, understand spending patterns across categories, and maintain an organized financial record.
          </p>

          {/* Feature Highlights on Open Background (Truthful wording) */}
          <div className="auth-feature-list">
            <div className="auth-feature-pill">
              <div className="auth-feature-icon cyan">
                <TrendingUp size={16} />
              </div>
              <div className="auth-feature-text">
                <strong>Spending Trends</strong>
                <span>Visualise your spending patterns</span>
              </div>
            </div>

            <div className="auth-feature-pill">
              <div className="auth-feature-icon purple">
                <PieChart size={16} />
              </div>
              <div className="auth-feature-text">
                <strong>Category Breakdown</strong>
                <span>Understand where your money goes</span>
              </div>
            </div>

            <div className="auth-feature-pill">
              <div className="auth-feature-icon emerald">
                <ShieldCheck size={16} />
              </div>
              <div className="auth-feature-text">
                <strong>Secure Authentication</strong>
                <span>User-specific expense data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frameless Register Form Area */}
        <div className="auth-form-section">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-heading">Create Account</h2>
              <p className="auth-form-desc">Sign up to start tracking your expenses today.</p>
            </div>

            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label htmlFor="reg-username">Username</label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="Choose a username"
                  className="auth-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Create a password (min 8 chars)"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <input
                  id="reg-confirm"
                  type="password"
                  placeholder="Confirm your password"
                  className="auth-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  disabled={loading}
                  required
                />
              </div>

              {error && (
                <div className="auth-error" role="alert">
                  {error}
                </div>
              )}

              <button className="auth-button" type="submit" disabled={loading}>
                <span>{loading ? "Creating account..." : "Get Started Now"}</span>
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="auth-switch">
              <span>Already have an account?</span>
              <button type="button" className="auth-link" onClick={onBackToLogin}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
