import { useEffect, useState } from "react";
import ExtensionList from "../components/ExtensionList";
import {
  deleteRule,
  getRules,
  saveRule,
  scanFolderExtensions,
  selectFolder,
  setRuleEnabled,
  updateRule,
} from "../services/fileforge";
import "./AdvancedSorting.css";

function folderName(path) {
  if (!path) return "";
  const clean = path.replace(/[\\/]+$/, "");
  return clean.split(/[\\/]/).pop() || clean;
}

function AdvancedSorting() {
  const [creatingRule, setCreatingRule] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [rules, setRules] = useState([]);
  const [ruleName, setRuleName] = useState("");
  const [watchFolder, setWatchFolder] = useState("");
  const [destination, setDestination] = useState("");
  const [extensions, setExtensions] = useState([]);
  const [selectedExtensions, setSelectedExtensions] = useState([]);
  const [runInBackground, setRunInBackground] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  async function loadRules() {
    try {
      setRules(await getRules());
    } catch (error) {
      setMessage(`Error loading rules: ${error}`);
    }
  }

  useEffect(() => {
    loadRules();
  }, []);

  useEffect(() => {
    function closeContextMenu() {
      setContextMenu(null);
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    }

    window.addEventListener("mousedown", closeContextMenu);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", closeContextMenu);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function resetForm() {
    setRuleName("");
    setWatchFolder("");
    setDestination("");
    setExtensions([]);
    setSelectedExtensions([]);
    setRunInBackground(true);
    setEditingRule(null);
  }

  function openNewRule() {
    resetForm();
    setMessage("");
    setCreatingRule(true);
  }

  async function openEditRule(rule) {
    setContextMenu(null);
    setCreatingRule(true);
    setEditingRule(rule);
    setRuleName(rule.rule_name);
    setWatchFolder(rule.watch_folder);
    setDestination(rule.destination);
    setSelectedExtensions(rule.extensions);
    setRunInBackground(rule.enabled);
    setMessage("");

    try {
      const scanned = await scanFolderExtensions(rule.watch_folder);
      const existing = new Set(scanned.map((item) => item.extension));
      const missingSelected = rule.extensions
        .filter((extension) => !existing.has(extension))
        .map((extension) => ({ extension, count: 0 }));

      setExtensions([...scanned, ...missingSelected]);
    } catch (error) {
      setExtensions(rule.extensions.map((extension) => ({ extension, count: 0 })));
      setMessage(`Could not rescan watch folder: ${error}`);
    }
  }

  async function chooseWatchFolder() {
    try {
      const selected = await selectFolder();
      if (!selected) return;

      setWatchFolder(selected);
      setExtensions(await scanFolderExtensions(selected));
      setSelectedExtensions([]);
    } catch (error) {
      setMessage(`Error scanning folder: ${error}`);
    }
  }

  async function chooseDestination() {
    try {
      const selected = await selectFolder();
      if (selected) setDestination(selected);
    } catch (error) {
      setMessage(`Error selecting destination: ${error}`);
    }
  }

  function toggleExtension(extension) {
    setSelectedExtensions((current) =>
      current.includes(extension)
        ? current.filter((item) => item !== extension)
        : [...current, extension]
    );
  }

  async function handleSaveRule() {
    if (!ruleName.trim()) {
      setMessage("Please enter a rule name.");
      return;
    }

    if (!watchFolder) {
      setMessage("Please select a watch folder.");
      return;
    }

    if (selectedExtensions.length === 0) {
      setMessage("Select at least one file extension.");
      return;
    }

    if (!destination) {
      setMessage("Please select a destination folder.");
      return;
    }

    try {
      setSaving(true);

      const ruleData = {
        id: editingRule?.id,
        rule_name: ruleName.trim(),
        watch_folder: watchFolder,
        extensions: selectedExtensions,
        destination,
        enabled: runInBackground,
      };

      const savedRule = editingRule
        ? await updateRule(ruleData)
        : await saveRule(ruleData);

      if (editingRule) {
        setRules((current) =>
          current.map((item) => (item.id === savedRule.id ? savedRule : item))
        );
        setMessage(
          runInBackground
            ? "Rule updated. Background sorting is running."
            : "Rule updated. Background sorting is paused."
        );
      } else {
        setRules((current) => [...current, savedRule]);
        setMessage(
          runInBackground
            ? "Rule saved. Background sorting is running."
            : "Rule saved. Background sorting is paused."
        );
      }

      resetForm();
      setCreatingRule(false);
    } catch (error) {
      setMessage(`Error saving rule: ${error}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleRule(rule) {
    setContextMenu(null);

    try {
      const updated = await setRuleEnabled(rule.id, !rule.enabled);
      setRules((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setMessage(
        updated.enabled
          ? `Background sorting enabled for "${updated.rule_name}".`
          : `Background sorting paused for "${updated.rule_name}".`
      );
    } catch (error) {
      setMessage(`Error updating rule: ${error}`);
    }
  }

  async function handleDeleteRule(rule) {
    setContextMenu(null);

    const confirmed = window.confirm(
      `Delete the rule "${rule.rule_name}"?\n\nThis only removes the rule. It will not delete or move any files.`
    );

    if (!confirmed) return;

    try {
      await deleteRule(rule.id);
      setRules((current) => current.filter((item) => item.id !== rule.id));
      setMessage(`Rule "${rule.rule_name}" deleted.`);
    } catch (error) {
      setMessage(`Error deleting rule: ${error}`);
    }
  }

  function showContextMenu(event, rule) {
    event.preventDefault();
    event.stopPropagation();

    const menuWidth = 190;
    const menuHeight = 126;
    const x = Math.min(event.clientX, window.innerWidth - menuWidth - 8);
    const y = Math.min(event.clientY, window.innerHeight - menuHeight - 8);

    setContextMenu({ x: Math.max(8, x), y: Math.max(8, y), rule });
  }

  function handleBack() {
    resetForm();
    setMessage("");
    setCreatingRule(false);
  }

  if (creatingRule) {
    return (
      <div className="work-panel">
        <div className="page-header">
          <div>
            <h1>{editingRule ? "Edit Sorting Rule" : "Create Sorting Rule"}</h1>
            <p>
              {editingRule
                ? "Modify how FileForge handles matching files."
                : "Configure a rule to automatically organize files."}
            </p>
          </div>

          <button className="secondary-button" onClick={handleBack}>
            ← Back
          </button>
        </div>

        {message && <div className="status-message">{message}</div>}

        <div className="rule-form">
          <div className="form-section">
            <label>Rule Name</label>
            <input
              type="text"
              value={ruleName}
              onChange={(event) => setRuleName(event.target.value)}
              placeholder="e.g. Move Java Files"
            />
          </div>

          <div className="form-section">
            <label>Watch Folder</label>
            <div className="path-row">
              <input
                type="text"
                value={watchFolder}
                placeholder="Select a folder..."
                readOnly
              />
              <button className="secondary-button" onClick={chooseWatchFolder}>
                Browse
              </button>
            </div>
          </div>

          <div className="form-section">
            <label>File Extensions</label>
            <ExtensionList
              extensions={extensions}
              selectedExtensions={selectedExtensions}
              onToggle={toggleExtension}
            />
          </div>

          <div className="form-section">
            <label>Destination</label>
            <div className="path-row">
              <input
                type="text"
                value={destination}
                placeholder="Select destination..."
                readOnly
              />
              <button className="secondary-button" onClick={chooseDestination}>
                Browse
              </button>
            </div>
          </div>

          <div className="form-section">
            <label>Background Running</label>
            <label className="extension-option">
              <input
                type="checkbox"
                checked={runInBackground}
                onChange={(event) => setRunInBackground(event.target.checked)}
              />
              <span>Automatically sort matching files when they arrive.</span>
            </label>
          </div>

          <div className="form-actions">
            <button
              className="primary-button"
              onClick={handleSaveRule}
              disabled={saving}
            >
              {saving
                ? editingRule
                  ? "Updating..."
                  : "Saving..."
                : editingRule
                  ? "Update Rule"
                  : "Save Rule"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="work-panel">
      <div className="page-header">
        <div>
          <h1>Advanced Sorting</h1>
          <p>Create rules to automatically organize files.</p>
        </div>

        <button className="primary-button" onClick={openNewRule}>
          + New Rule
        </button>
      </div>

      {message && <div className="status-message">{message}</div>}

      {rules.length === 0 ? (
        <div className="empty-panel">
          <strong>No sorting rules</strong>
          <p>
            Create a rule to automatically move specific file types between folders.
          </p>
        </div>
      ) : (
        <div className="result-panel rules-panel">
          <div className="result-header">
            <strong>Sorting Rules</strong>
            <span>
              {rules.length} rule{rules.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="result-list rules-list">
            {rules.map((rule) => (
              <div
                className="rule-row"
                key={rule.id}
                onContextMenu={(event) => showContextMenu(event, rule)}
              >
                <div className="rule-info">
                  <div className="rule-title-row">
                    <strong>{rule.rule_name}</strong>
                    <span
                      className={`rule-status ${rule.enabled ? "running" : "paused"}`}
                    >
                      {rule.enabled ? "Running" : "Paused"}
                    </span>
                  </div>

                  <div className="rule-summary">
                    <span>WATCH: {folderName(rule.watch_folder)}</span>
                    <span>FILES: {rule.extensions.join(", ")}</span>
                    <span>MOVE TO: {folderName(rule.destination)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contextMenu && (
        <div
          className="native-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseDown={(event) => event.stopPropagation()}
          onContextMenu={(event) => event.preventDefault()}
        >
          <button onClick={() => openEditRule(contextMenu.rule)}>Edit</button>
          <button onClick={() => handleToggleRule(contextMenu.rule)}>
            {contextMenu.rule.enabled ? "Pause" : "Run"}
          </button>
          <div className="context-separator" />
          <button
            className="delete-context-item"
            onClick={() => handleDeleteRule(contextMenu.rule)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default AdvancedSorting;
