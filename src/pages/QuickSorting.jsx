import { useEffect, useState } from "react";
import {
  quickSort,
  scanDownloads,
  undoSort,
} from "../services/fileforge";

function QuickSorting() {
  const [message, setMessage] = useState("");
  const [sortResult, setSortResult] = useState(null);
  const [fileCount, setFileCount] = useState(0);

  async function refreshFileCount() {
    try {
      const count = await scanDownloads();
      setFileCount(count);
    } catch (error) {
      setMessage(`Error: ${error}`);
    }
  }

  useEffect(() => {
    refreshFileCount();
  }, []);

  async function runQuickSort() {
    try {
      const count = await scanDownloads();
      setFileCount(count);

      if (count === 0) {
        setMessage("No files found in Downloads.");
        return;
      }

      const result = await quickSort();

      setSortResult(result);
      setMessage("");

      const remaining = await scanDownloads();
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
          <p>Organize your Downloads folder with one click.</p>
        </div>
      </div>

      <div className="toolbar">
        <button
          onClick={runQuickSort}
          disabled={fileCount === 0}
          className="rounded-xl bg-white px-6 py-3 text-sm font-medium text-black hover:bg-zinc-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ⚡ Sort Downloads
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
          <strong>Downloads</strong>
          <p>
            Click "Sort Downloads" to organize your files.
          </p>
        </div>
      )}
    </div>
  );
}

export default QuickSorting;
