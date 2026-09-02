import { useState, useEffect } from "react";
import { Sparkles, Sun, Moon } from "lucide-react";
import { getInitialTheme, applyTheme } from "../utils/theme";

function AuthNavbar() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <header className="auth-navbar">
      <div className="auth-navbar-inner">
        {/* Left: Brand Identity */}
        <div className="auth-nav-brand">
          <div className="auth-nav-logo-glow" />
          <div className="auth-nav-logo">
            <Sparkles size={18} className="auth-nav-icon" />
          </div>
          <span className="auth-nav-title">Expense Tracker</span>
        </div>

        {/* Right: Actions */}
        <div className="auth-nav-actions">
          {/* Dark / Light Mode Toggle */}
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}

export default AuthNavbar;
