import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CursorGlow from "./components/CursorGlow";
import AmbientNetworkAurora from "./components/AmbientNetworkAurora";
import AuthNavbar from "./components/AuthNavbar";
import AppFooter from "./components/AppFooter";
import { isAuthenticated, removeToken } from "./auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    removeToken();
    setLoggedIn(false);
    setShowRegister(false);
  };

  const renderContent = () => {
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
  };

  return (
    <div className="app-root-layout">
      <AmbientNetworkAurora />
      <CursorGlow />
      {!loggedIn && <AuthNavbar />}
      <main className="app-main-viewport">
        {renderContent()}
      </main>
      <AppFooter />
    </div>
  );
}

export default App;
