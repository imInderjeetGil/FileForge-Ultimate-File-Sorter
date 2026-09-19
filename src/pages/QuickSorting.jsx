import { useEffect, useState } from "react";

import {
  quickSort,
  scanFolder,
  undoSort,
  selectFolder,
  getDownloadsFolder,
} from "../services/fileforge";

function QuickSorting() {
  const [message, setMessage] = useState("");
  const [sortResult, setSortResult] = useState(null);
  const [fileCount, setFileCount] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState("");

  async function refreshFileCount(folder = selectedFolder) {
    if (!folder) return;

    try {
      const count = await scanFolder(folder);
      setFileCount(count);
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  }

  useEffect(() => {
    async function initialize() {
      try {
        const downloads = await getDownloadsFolder();

        setSelectedFolder(downloads);

        const count = await scanFolder(downloads);
        setFileCount(count);
      } catch (error) {
        setMessage(`Error: ${error}`);
      }
    }

    initialize();
  }, []);

  async function handleBrowse() {
    try {
      const folder = await selectFolder();

      if (!folder) return;

      setSelectedFolder(folder);
      setSortResult(null);
      setMessage("");

      await refreshFileCount(folder);
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  }

  async function runQuickSort() {
    if (!selectedFolder) {
      setMessage("Please select a folder first.");
      return;
    }

    try {
      const count = await scanFolder(selectedFolder);
      setFileCount(count);

      if (count === 0) {
        setMessage("No files found in the selected folder.");
        return;
      }

      const result = await quickSort(selectedFolder);

      setSortResult(result);
      setMessage("");

      const remaining = await scanFolder(selectedFolder);
      setFileCount(remaining);
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  }

  async function handleUndoSort() {
    try {
      const result = await undoSort();

      setSortResult(null);
      setMessage(result);

      await refreshFileCount();
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  }

  return (
    <div className="work-panel">
      <div className="page-header">
        <div>
          <h1>Quick Sorting</h1>
          <p>Organize files from any folder with one click.</p>
        </div>
      </div>

      <div className="form-section" style={{ marginTop: "20px" }}>
        <label>Folder to sort</label>

        <div className="path-row">
          <input
            type="text"
            value={selectedFolder}
            readOnly
            placeholder="Select a folder..."
          />

          <button
            className="secondary-button"
            onClick={handleBrowse}
          >
            Browse
          </button>
        </div>
      </div>

      <div className="toolbar">
        <button
          onClick={runQuickSort}
          disabled={!selectedFolder || fileCount === 0}
          className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⚡ Quick Sort
        </button>

        <button id="UndoBtn" onClick={handleUndoSort}>
          ↶ Undo
        </button>
      </div>

      {message && (
        <div className="status-message">
          {message}
        </div>
      )}

      {sortResult && (
        <div className="result-panel">
          <div className="result-header">
            <strong>✓ Sorting Complete</strong>
            <span>{sortResult.total} files organized</span>
          </div>

          <div className="result-list">
            {sortResult.documents > 0 && (
              <div>
                <span>📄 Documents</span>
                <span>{sortResult.documents}</span>
              </div>
            )}

            {sortResult.images > 0 && (
              <div>
                <span>🖼 Images</span>
                <span>{sortResult.images}</span>
              </div>
            )}

            {sortResult.videos > 0 && (
              <div>
                <span>🎬 Videos</span>
                <span>{sortResult.videos}</span>
              </div>
            )}

            {sortResult.music > 0 && (
              <div>
                <span>🎵 Music</span>
                <span>{sortResult.music}</span>
              </div>
            )}

            {sortResult.archives > 0 && (
              <div>
                <span>📦 Archives</span>
                <span>{sortResult.archives}</span>
              </div>
            )}

            {sortResult.installers > 0 && (
              <div>
                <span>⚙ Installers</span>
                <span>{sortResult.installers}</span>
              </div>
            )}

            {sortResult.miscellaneous > 0 && (
              <div>
                <span>📁 Miscellaneous</span>
                <span>{sortResult.miscellaneous}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {!sortResult && !message && (
        <div className="empty-panel">
          <strong>
            {selectedFolder
              ? "Selected Folder"
              : "No Folder Selected"}
          </strong>

          <p>
            {selectedFolder
              ? "Choose Quick Sort to organize the files in this folder."
              : "Click Browse to select a folder."}
          </p>
        </div>
      )}
    </div>
  );
}

export default QuickSorting;