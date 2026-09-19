import {
  ArrowLeft24Regular,
  Code24Regular,
  Document24Regular,
  FolderOpen24Regular,
  History24Regular,
  Open24Regular,
  ShieldCheckmark24Regular,
  WindowApps24Regular,
} from "@fluentui/react-icons";

import fileforgeIcon from "../assets/fileforge-icon.png";
import { openUrl } from "@tauri-apps/plugin-opener";
import "./About.css";

function About({ onBack }) {
  async function openDocumentation() {
    await openUrl("https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter/releases");
  }

  async function reportProblem() {
    await openUrl("https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter/issues");
  }

  async function openGitHub() {
    await openUrl("https://github.com/imInderjeetGil/FileForge-Ultimate-File-Sorter");
  }

  return (
    <div className="about-page">

      <div className="about-page-header">
        <button
          className="secondary-button"
          onClick={onBack}
        >
          <ArrowLeft24Regular />
          Back
        </button>
      </div>

      <div className="about-content">

        <div className="about-hero">
          <div className="about-logo">
  <img
    src={fileforgeIcon}
    alt="FileForge"
  />
</div>

          <h1>FileForge</h1>

          <p>
            Just sort your messed Downloads Folder.
          </p>

          <span className="about-version">
            Version 1.1.0
          </span>
        </div>

        <div className="about-section">
          <h2>What is FileForge?</h2>

          <p>
            FileForge is a lightweight Windows file organizer designed
            to keep messy folders under control without complicated
            workflows.
          </p>

          <p>
            Use Quick Sorting for immediate cleanup or create
            Advanced Sorting rules that automatically organize files
            whenever they appear in a watched folder.
          </p>
        </div>

        <div className="about-section">
          <h2>Features</h2>

          <div className="about-feature-grid">

            <div className="about-feature">
              <FolderOpen24Regular />
              <div>
                <strong>Quick Sorting</strong>
                <span>Organize files with one click.</span>
              </div>
            </div>

            <div className="about-feature">
              <Code24Regular />
              <div>
                <strong>Advanced Rules</strong>
                <span>Create custom file organization rules.</span>
              </div>
            </div>

            <div className="about-feature">
              <WindowApps24Regular />
              <div>
                <strong>Background Sorting</strong>
                <span>Rules can run automatically in the background.</span>
              </div>
            </div>

            <div className="about-feature">
              <History24Regular />
              <div>
                <strong>Activity History</strong>
                <span>See what FileForge has organized.</span>
              </div>
            </div>

            <div className="about-feature">
              <ShieldCheckmark24Regular />
              <div>
                <strong>Safe File Handling</strong>
                <span>Files are moved according to explicit rules.</span>
              </div>
            </div>

            <div className="about-feature">
              <Document24Regular />
              <div>
                <strong>Extension Based</strong>
                <span>Choose exactly which file types to organize.</span>
              </div>
            </div>

          </div>
        </div>

        <div className="about-section">
          <h2>Built With</h2>

          <div className="about-tech-stack">
            <span>Tauri</span>
            <span>React</span>
            <span>Rust</span>
            <span>Vite</span>
          </div>
        </div>

        <div className="about-section about-links-section">
          <h2>Project</h2>

          <div className="about-actions">

            <button
              className="secondary-button"
              onClick={openDocumentation}
            >
              <Document24Regular />
              Documentation
              <Open24Regular />
            </button>

            <button
              className="secondary-button"
              onClick={openGitHub}
            >
              GitHub
              <Open24Regular />
            </button>

            <button
              className="secondary-button"
              onClick={reportProblem}
            >
              Report a Problem
              <Open24Regular />
            </button>

          </div>
        </div>

        <div className="about-footer">
          FileForge — Windows File Organizer
        </div>

      </div>
    </div>
  );
}

export default About;