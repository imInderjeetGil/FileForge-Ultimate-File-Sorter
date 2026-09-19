import { useEffect, useRef, useState } from "react";
import Home from "../pages/Home";
import QuickSorting from "../pages/QuickSorting";
import AdvancedSorting from "../pages/AdvancedSorting";
import About from "../pages/About";
import { openDownloadsFolder,exitApp } from "../services/fileforge";

import {
  Home24Regular,
  Home24Filled,
  FolderOpen24Regular,
  FolderOpen24Filled,
  Settings24Regular,
  Settings24Filled,
} from "@fluentui/react-icons";


function AppShell() {
  const [screen, setScreen] = useState("home");
  const [openMenu, setOpenMenu] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showSecurityNotice, setShowSecurityNotice] = useState(false);
const [securityNoticeChecked, setSecurityNoticeChecked] = useState(false);
const [startNewRule, setStartNewRule] = useState(false);
const [openNewRule, setOpenNewRule] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
  if (screen !== "advanced" || securityNoticeChecked) {
    return;
  }

  const noticeShown = localStorage.getItem(
    "fileforge_security_notice_shown"
  );

  if (!noticeShown) {
    setShowSecurityNotice(true);
  }

  setSecurityNoticeChecked(true);
}, [screen, securityNoticeChecked]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpenMenu(null);
      }
    }


    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setShowAbout(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  function toggleMenu(menu) {
    setOpenMenu((current) =>
      current === menu ? null : menu
    );
  }

  function navigate(menuScreen) {
    setScreen(menuScreen);
    setOpenMenu(null);
  }

  function comingSoon() {
    setOpenMenu(null);
  }

function renderScreen() {
  switch (screen) {
    case "quick":
      return <QuickSorting />;

    case "advanced":
  return (
    <AdvancedSorting
      openNewRule={openNewRule}
      onNewRuleOpened={() => setOpenNewRule(false)}
    />
  );

    case "about":
      return (
        <About
          onBack={() => setScreen("home")}
        />
      );

    case "home":
    default:
      return <Home />;
  }
}
  return (
    <div className="app">

      {/* Menu Bar */}

      <div className="menu-bar" ref={menuRef}>

        {/* File */}

        <div className="menu-wrapper">
          <button
            className={`menu-button ${
              openMenu === "file" ? "open" : ""
            }`}
            onClick={() => toggleMenu("file")}
          >
            File
          </button>

          {openMenu === "file" && (
            <div className="dropdown-menu">

              <button
  onClick={() => {
    setOpenNewRule(true);
    setScreen("advanced");
    setOpenMenu(null);
  }}
>
  New Sorting Rule
</button>

             <button onClick={openDownloadsFolder}>
  Open Downloads Folder
</button>
<button onClick={exitApp}>
  Exit
</button>

              <div className="menu-separator" />
  

            </div>
          )}
        </div>


        {/* Tools */}

        <div className="menu-wrapper">
          <button
            className={`menu-button ${
              openMenu === "tools" ? "open" : ""
            }`}
            onClick={() => toggleMenu("tools")}
          >
            Tools
          </button>

          {openMenu === "tools" && (
            <div className="dropdown-menu">

              <button
                onClick={() => navigate("quick")}
              >
                Quick Sort
              </button>

              <button
                onClick={() => navigate("advanced")}
              >
                Advanced Sorting
              </button>

              

            </div>
          )}
        </div>


        {/* View */}

        <div className="menu-wrapper">
          <button
            className={`menu-button ${
              openMenu === "view" ? "open" : ""
            }`}
            onClick={() => toggleMenu("view")}
          >
            View
          </button>

          {openMenu === "view" && (
            <div className="dropdown-menu">

              <button
                onClick={() => navigate("home")}
              >
                Refresh Dashboard
              </button>

              <div className="menu-separator" />

              <button
                onClick={() => navigate("home")}
              >
                Activity History
              </button>

              <button
                onClick={() => navigate("home")}
              >
                Folder Mappings
              </button>

            </div>
          )}
        </div>


        {/* Help */}

        <div className="menu-wrapper">
          <button
            className={`menu-button ${
              openMenu === "help" ? "open" : ""
            }`}
            onClick={() => toggleMenu("help")}
          >
            Help
          </button>

          {openMenu === "help" && (
            <div className="dropdown-menu">

              <button
  onClick={() => {
    setOpenMenu(null);
    setScreen("about");
  }}
>
  About FileForge
</button>

            </div>
          )}
        </div>

      </div>


      {/* Toolbar */}

      <div className="main-toolbar">

        <div className="toolbar-title">
          <strong>FileForge</strong>
        </div>

        <div className="toolbar-separator" />

        <span className="toolbar-hint">
          File Organizer
        </span>

      </div>


      {/* Main */}

      <div className="main-area">

        <aside className="sidebar">

          <div className="sidebar-title">
            Functions
          </div>

          <button
  className={`nav-item ${screen === "home" ? "active" : ""}`}
  onClick={() => setScreen("home")}
>
  {screen === "home" ? (
    <Home24Filled />
  ) : (
    <Home24Regular />
  )}
  Home
</button>

<button
  className={`nav-item ${screen === "quick" ? "active" : ""}`}
  onClick={() => setScreen("quick")}
>
  {screen === "quick" ? (
    <FolderOpen24Filled />
  ) : (
    <FolderOpen24Regular />
  )}
  Quick Sorting
</button>

<button
  className={`nav-item ${screen === "advanced" ? "active" : ""}`}
  onClick={() => setScreen("advanced")}
>
  {screen === "advanced" ? (
    <Settings24Filled />
  ) : (
    <Settings24Regular />
  )}
  Advanced Sorting
</button>

        </aside>

        <section className="content">
          {renderScreen()}
        </section>

      </div>


      {/* Status Bar */}

      <div className="status-bar">
        <span>Ready</span>
        <span>FileForge</span>
      </div>


      {showSecurityNotice && (
  <div className="security-overlay">
    <div className="security-dialog">
      <h2>Windows Security Notice</h2>

      <p>
        FileForge may need permission from Windows Controlled Folder
        Access to move files automatically.
      </p>

      <p>
        If Windows blocks FileForge, go to:
      </p>

      <div className="security-path">
        Windows Security → Virus & threat protection
        → Ransomware protection
        → Allow an app through Controlled folder access
      </div>

      <p>
        Add <strong>FileForge</strong> to the allowed apps list.
      </p>

      <div className="security-actions">
        <button
          className="primary-button"
          onClick={() => setShowSecurityNotice(false)}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default AppShell;