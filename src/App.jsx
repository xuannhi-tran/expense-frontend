import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CursorGlow from "./components/CursorGlow";
import AmbientNetworkAurora from "./components/AmbientNetworkAurora";
import AuthNavbar from "./components/AuthNavbar";
import AppFooter from "./components/AppFooter";
import DemoBanner from "./components/DemoBanner";
import { isAuthenticated, removeToken } from "./auth";
import { isDemo, enterDemo, exitDemo } from "./demo";

function App() {
  const [loggedIn, setLoggedIn] = useState(() => isDemo() || isAuthenticated());
  const [showRegister, setShowRegister] = useState(false);

  const handleTryDemo = () => {
    enterDemo();
    setLoggedIn(true);
  };

  const handleLogout = () => {
    if (isDemo()) {
      exitDemo();
      return;
    }
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
          onDemo={handleTryDemo}
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
      {isDemo() && <DemoBanner onExit={exitDemo} />}
      <AppFooter />
    </div>
  );
}

export default App;
