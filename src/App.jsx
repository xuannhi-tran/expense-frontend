import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { isAuthenticated, removeToken } from "./auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
  };

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
