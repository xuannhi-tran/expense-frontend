import { useState, useRef } from "react";
import { Sparkles, TrendingUp, ShieldCheck, PieChart, ArrowRight, ChevronDown } from "lucide-react";
import api from "../api";
import { saveToken } from "../auth";
import "../styles/auth.css";

function Login({ onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formStageRef = useRef(null);

  const handleContinueToSignIn = () => {
    if (formStageRef.current) {
      formStageRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
    } catch (err) {
      console.error(err);
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-storytelling">
      {/* ====================================================================
          STAGE 1: Full-Screen Grand Welcome Hero
          ==================================================================== */}
      <section className="auth-hero-welcome-stage">
        <div className="welcome-grand-hero-content">
          <div className="welcome-grand-badge">
            <Sparkles size={18} className="badge-sparkle" />
            <span>Expense Tracker</span>
          </div>

          <h1 className="welcome-massive-title">Welcome</h1>

          <p className="welcome-hero-subtext">
            Smart financial clarity &amp; intelligent spending management.
          </p>

          <button
            type="button"
            className="btn-scroll-indicator"
            onClick={handleContinueToSignIn}
            aria-label="Continue to sign in"
          >
            <span>Continue to Sign In</span>
            <ChevronDown size={18} className="scroll-arrow-bounce" />
          </button>
        </div>
      </section>

      {/* ====================================================================
          STAGE 2: App Introduction & Login Credentials Form
          ==================================================================== */}
      <section id="login-form-stage" ref={formStageRef} className="auth-main-stage">
        <div className="auth-container">
          {/* Left: Open Background App Description & Features */}
          <div className="auth-hero-section">
            <div className="auth-brand-badge">
              <div className="auth-brand-logo-glow" />
              <div className="auth-brand-logo">
                <Sparkles size={20} className="auth-brand-icon" />
              </div>
              <span className="auth-brand-name">Expense Tracker</span>
              <span className="auth-brand-tag">SPENDING HUB</span>
            </div>

            <h2 className="auth-hero-title">
              Smart spending intelligence, <br className="hidden-mobile" />
              <span className="gradient-text">designed for clarity.</span>
            </h2>

            <p className="auth-hero-desc">
              Take command of your expenses with visual spending patterns, category analytics, and user-specific tracking.
            </p>

            {/* Feature Highlights on Open Background (Accurate & Truthful) */}
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

          {/* Right: Frameless Login Credentials Form */}
          <div className="auth-form-section">
            <div className="auth-card">
              <div className="auth-card-header">
                <h3 className="auth-card-heading">Sign In</h3>
                <p className="auth-form-desc">
                  Enter your credentials to access your financial dashboard.
                </p>
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
                    autoComplete="username"
                    disabled={loading}
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
                    autoComplete="current-password"
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
      </section>
    </div>
  );
}

export default Login;
