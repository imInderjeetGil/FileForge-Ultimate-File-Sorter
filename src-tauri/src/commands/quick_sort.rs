use crate::models::{FileMove, SortHistory};
use crate::services::history::{history_path, save_history};
use std::path::PathBuf;

fn downloads_path() -> Result<PathBuf, String> {
    let profile = std::env::var("USERPROFILE").map_err(|e| e.to_string())?;
    Ok(PathBuf::from(profile).join("Downloads"))
}

#[tauri::command]
pub fn scan_downloads() -> Result<usize, String> {
    let entries = std::fs::read_dir(downloads_path()?).map_err(|e| e.to_string())?;
    Ok(entries
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path())
        .filter(|path| path.is_file())
        .count())
}

#[derive(serde::Serialize)]
pub struct SortResult {
    pub total: usize,
    pub documents: usize,
    pub images: usize,
    pub videos: usize,
    pub music: usize,
    pub archives: usize,
    pub installers: usize,
    pub miscellaneous: usize,
}

#[tauri::command]
pub fn quick_sort() -> Result<SortResult, String> {
    let downloads = downloads_path()?;
    let categories = [
        ("Documents", vec![".pdf", ".doc", ".docx", ".txt", ".xlsx", ".xls", ".ppt", ".pptx"]),
        ("Images", vec![".jpg", ".jpeg", ".png", ".gif", ".webp"]),
        ("Videos", vec![".mp4", ".mkv", ".avi", ".mov"]),
        ("Music", vec![".mp3", ".wav", ".flac", ".aac"]),
        ("Archives", vec![".zip", ".rar", ".7z", ".tar", ".gz"]),
        ("Installers", vec![".exe", ".msi"]),
    ];

    let files: Vec<_> = std::fs::read_dir(&downloads)
        .map_err(|e| e.to_string())?
        .filter_map(|entry| entry.ok())
        .map(|entry| entry.path())
        .filter(|path| path.is_file())
        .collect();

    if files.is_empty() {
        return Err("No files found in Downloads.".to_string());
    }

    let mut history = SortHistory::default();
    let mut counts = [0usize; 7];

    for file in files {
        let extension = file.extension().and_then(|e| e.to_str()).map(|e| format!(".{e}").to_lowercase()).unwrap_or_default();
        let mut category = "Miscellaneous";
        let mut index = 6;

        for (i, (name, extensions)) in categories.iter().enumerate() {
            if extensions.contains(&extension.as_str()) {
                category = name;
                index = i;
                break;
            }
        }
        counts[index] += 1;

        let destination_folder = downloads.join(category);
        let existed = destination_folder.exists();
        std::fs::create_dir_all(&destination_folder).map_err(|e| e.to_string())?;
        if !existed {
            history.created_folders.push(destination_folder.to_string_lossy().to_string());
        }

        let file_name = file.file_name().ok_or("Invalid file name")?;
        let mut destination = destination_folder.join(file_name);
        let mut counter = 1;
        while destination.exists() {
            let stem = file.file_stem().and_then(|s| s.to_str()).unwrap_or("file");
            let ext = file.extension().and_then(|s| s.to_str()).map(|s| format!(".{s}")).unwrap_or_default();
            destination = destination_folder.join(format!("{stem}_{counter}{ext}"));
            counter += 1;
        }

        std::fs::rename(&file, &destination).map_err(|e| e.to_string())?;
        history.moves.push(FileMove {
            from: file.to_string_lossy().to_string(),
            to: destination.to_string_lossy().to_string(),
        });
    }

    save_history(&history)?;
    Ok(SortResult {
        total: history.moves.len(),
        documents: counts[0], images: counts[1], videos: counts[2], music: counts[3],
        archives: counts[4], installers: counts[5], miscellaneous: counts[6],
    })
}

#[tauri::command]
pub fn undo_sort() -> Result<String, String> {
    let path = history_path()?;
    if !path.exists() { return Ok("Nothing to undo.".to_string()); }

    let json = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let history: SortHistory = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    if history.moves.is_empty() { return Ok("Nothing to undo.".to_string()); }

    let mut restored = 0;
    for file_move in history.moves.iter().rev() {
        let from = PathBuf::from(&file_move.from);
        let to = PathBuf::from(&file_move.to);
        if to.exists() {
            std::fs::rename(to, from).map_err(|e| e.to_string())?;
            restored += 1;
        }
    }

    for folder in history.created_folders.iter().rev() {
        let path = PathBuf::from(folder);
        if path.exists() { let _ = std::fs::remove_dir(path); }
    }

    std::fs::write(path, "{}").map_err(|e| e.to_string())?;
    Ok(format!("Restored {restored} files."))
}
