use crate::models::SortHistory;
use std::fs;
use std::path::PathBuf;

pub fn history_path() -> Result<PathBuf, String> {
    let app_data = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    let dir = PathBuf::from(app_data).join("FileForge");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("history.json"))
}

pub fn save_history(history: &SortHistory) -> Result<(), String> {
    let json = serde_json::to_string_pretty(history).map_err(|e| e.to_string())?;
    fs::write(history_path()?, json).map_err(|e| e.to_string())
}
