import { useState } from "react";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

import { isAuthenticated, removeToken } from "./auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    setShowRegister(false);
  };

  if (!loggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegister={() => setShowRegister(false)}
          onBackToLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={() => setLoggedIn(true)}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
