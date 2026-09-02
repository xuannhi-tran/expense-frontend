import { useState } from "react";
import { Sparkles, TrendingUp, ShieldCheck, PieChart, ArrowRight } from "lucide-react";
import api from "../api";
import { saveToken } from "../auth";
import "../styles/auth.css";

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api-token-auth/", {
        username,
        password,
      });

      saveToken(response.data.token);
      onLogin();
    } catch (error) {
      console.error(error);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Open Background Hero Showcase (Text on the overall background) */}
        <div className="auth-hero-section">
          <div className="auth-brand-badge">
            <div className="auth-brand-logo-glow" />
            <div className="auth-brand-logo">
              <Sparkles size={22} className="auth-brand-icon" />
            </div>
            <span className="auth-brand-name">Expense Tracker</span>
            <span className="auth-brand-tag">Live Hub</span>
          </div>

          <h1 className="auth-hero-title">
            Smart spending intelligence, <br className="hidden-mobile" />
            <span className="gradient-text">designed for clarity.</span>
          </h1>

          <p className="auth-hero-desc">
            Take command of your wealth with interactive category analytics, live budget curves, and automated spending insights.
          </p>

          {/* Feature Highlights on Open Background */}
          <div className="auth-feature-list">
            <div className="auth-feature-pill">
              <div className="auth-feature-icon cyan">
                <TrendingUp size={16} />
              </div>
              <div className="auth-feature-text">
                <strong>Real-time Trends</strong>
                <span>Instant visual spending curves</span>
              </div>
            </div>

            <div className="auth-feature-pill">
              <div className="auth-feature-icon purple">
                <PieChart size={16} />
              </div>
              <div className="auth-feature-text">
                <strong>Category Breakdown</strong>
                <span>Interactive donut distribution</span>
              </div>
            </div>

            <div className="auth-feature-pill">
              <div className="auth-feature-icon emerald">
                <ShieldCheck size={16} />
              </div>
              <div className="auth-feature-text">
                <strong>Bank-Grade Privacy</strong>
                <span>Encrypted token authentication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Glassmorphic Login Form Card */}
        <div className="auth-form-section">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Welcome Back</h2>
              <p>Enter your credentials to access your financial dashboard.</p>
            </div>

            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="auth-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="auth-error">{error}</div>}

              <button className="auth-button" type="submit" disabled={loading}>
                <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="auth-switch">
              <span>New to Expense Tracker?</span>
              <button type="button" className="auth-link" onClick={onRegister}>
                Create an account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
