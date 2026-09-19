import { useEffect, useState } from "react";

import {
  clearActivity,
  getActivity,
  getRules,
} from "../services/fileforge";

function Home() {
  const [rules, setRules] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filesOrganized, setFilesOrganized] = useState(0);

  async function loadDashboard() {
  try {
    const [rulesData, activityData] = await Promise.all([
      getRules(),
      getActivity(),
    ]);

    setRules(rulesData || []);
    setActivity(activityData || []);

    if (activityData && activityData.length > 0) {
      setFilesOrganized((current) =>
        Math.max(current, activityData.length)
      );
    }
  } catch (error) {
    console.error("Failed to load dashboard:", error);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadDashboard();
  }, []);

  const runningRules = rules.filter((rule) => rule.enabled).length;

  const lastActivity =
    activity.length > 0
      ? activity[activity.length - 1]
      : null;

  const recentActivity = [...activity]
    .reverse()
    .slice(0, 10);

  function formatTimestamp(timestamp) {
    if (!timestamp) return "—";

    const date = new Date(Number(timestamp));

    if (Number.isNaN(date.getTime())) {
      return timestamp;
    }

    return date.toLocaleString();
  }

  function shortPath(path) {
    if (!path) return "—";

    if (path.length <= 55) {
      return path;
    }

    return `...${path.slice(-52)}`;
  }

  async function handleClearActivity() {
    if (activity.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      "Clear all Recent Activity?\n\nThis will not undo or move any files."
    );

    if (!confirmed) {
      return;
    }

    try {
      await clearActivity();

      setActivity([]);
    } catch (error) {
      console.error("Failed to clear activity:", error);
    }
  }

  if (loading) {
    return (
      <div className="work-panel">
        <div className="page-header">
          <div>
            <h1>FileForge</h1>
            <p>Just sort your messed Downloads Folder.</p>
          </div>
        </div>

        <div className="status-message">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="work-panel home-dashboard">

      {/* Header */}
      <div className="page-header">
        <div>
          <h1>FileForge</h1>
          <p>Just sort your messed Downloads Folder.</p>
        </div>

        <button
          className="secondary-button"
          onClick={loadDashboard}
        >
          Refresh
        </button>
      </div>

      {/* Overview */}
      <div className="dashboard-section">
        <div className="section-title">
          Activity Overview
        </div>

        <div className="overview-grid">

          <div className="overview-card">
            <div className="overview-label">
              Rules
            </div>

            <div className="overview-value">
              {rules.length}
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-label">
              Running
            </div>

            <div className="overview-value">
              {runningRules}
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-label">
              Files Organized
            </div>

            <div className="overview-value">
              {filesOrganized}
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-label">
              Last Activity
            </div>

            <div className="overview-value overview-last">
              {lastActivity
                ? formatTimestamp(lastActivity.timestamp)
                : "Never"}
            </div>
          </div>

        </div>
      </div>

      {/* Folder mappings */}
      <div className="dashboard-section">
        <div className="section-title">
          Folder Mappings
        </div>

        {rules.length === 0 ? (
          <div className="dashboard-empty">
            No sorting rules configured.
          </div>
        ) : (
          <div className="mapping-list">
            {rules.map((rule) => (
              <div
                className="mapping-row"
                key={rule.id}
              >
                <div className="mapping-main">

                  <div className="mapping-name">
                    {rule.rule_name}
                  </div>

                  <div className="mapping-line">
                    <strong>WATCH:</strong>{" "}
                    {shortPath(rule.watch_folder)}
                  </div>

                  <div className="mapping-line">
                    <strong>MOVE TO:</strong>{" "}
                    {shortPath(rule.destination)}
                  </div>

                  <div className="mapping-line">
                    <strong>FILES:</strong>{" "}
                    {rule.extensions?.join(", ") || "—"}
                  </div>

                </div>

                <div
                  className={`rule-status ${
                    rule.enabled ? "running" : "paused"
                  }`}
                >
                  {rule.enabled ? "Running" : "Paused"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity */}
      <div className="dashboard-section">

        <div className="section-title activity-section-title">
          <span>Recent Activity</span>

          <button
            className="clear-activity-button"
            onClick={handleClearActivity}
            disabled={activity.length === 0}
          >
            Clear
          </button>
        </div>

        {recentActivity.length === 0 ? (
          <div className="dashboard-empty">
            No files have been organized yet.
          </div>
        ) : (
          <div className="activity-table">

            <div className="activity-header">
              <span>Time</span>
              <span>File</span>
              <span>Rule</span>
              <span>Move</span>
            </div>

            {recentActivity.map((entry, index) => (
              <div
                className="activity-row"
                key={`${entry.timestamp}-${entry.file_name}-${index}`}
              >
                <span>
                  {formatTimestamp(entry.timestamp)}
                </span>

                <span title={entry.file_name}>
                  {entry.file_name}
                </span>

                <span>
                  {entry.rule_name}
                </span>

                <span
                  className="activity-move"
                  title={`${entry.source} → ${entry.destination}`}
                >
                  {shortPath(entry.source)}
                  {" → "}
                  {shortPath(entry.destination)}
                </span>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Home;