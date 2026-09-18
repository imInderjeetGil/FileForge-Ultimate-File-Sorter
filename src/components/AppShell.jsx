import { useState } from "react";
import Home from "../pages/Home";
import QuickSorting from "../pages/QuickSorting";
import AdvancedSorting from "../pages/AdvancedSorting";

function AppShell() {
  const [screen, setScreen] = useState("home");

  function renderScreen() {
    switch (screen) {
      case "quick":
        return <QuickSorting />;
      case "advanced":
        return <AdvancedSorting />;
      case "home":
      default:
        return <Home />;
    }
  }

  return (
    <div className="app">
      <div className="menu-bar">
        <span>File</span>
        <span>Tools</span>
        <span>View</span>
        <span>Help</span>
      </div>

      <div className="main-toolbar">
        <div className="toolbar-title">
          <span className="app-icon">⚡</span>
          <strong>FileForge</strong>
        </div>

        <div className="toolbar-separator" />

        <span className="toolbar-hint">
          File Organizer
        </span>
      </div>

      <div className="main-area">
        <aside className="sidebar">
          <div className="sidebar-title">
            FileForge
          </div>

          <button
            className={`nav-item ${screen === "home" ? "active" : ""}`}
            onClick={() => setScreen("home")}
          >
            🏠 Home
          </button>

          <button
            className={`nav-item ${screen === "quick" ? "active" : ""}`}
            onClick={() => setScreen("quick")}
          >
            ⚡ Quick Sorting
          </button>

          <button
            className={`nav-item ${screen === "advanced" ? "active" : ""}`}
            onClick={() => setScreen("advanced")}
          >
            ⚙ Advanced Sorting
          </button>
        </aside>

        <section className="content">
          {renderScreen()}
        </section>
      </div>

      <div className="status-bar">
        <span>Ready</span>
        <span>FileForge</span>
      </div>
    </div>
  );
}

export default AppShell;
