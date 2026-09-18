use crate::models::ActivityEntry;
use std::fs;
use std::path::PathBuf;

fn app_data_dir() -> Result<PathBuf, String> {
    let app_data = std::env::var("APPDATA")
        .map_err(|e| e.to_string())?;

    let directory = PathBuf::from(app_data).join("FileForge");

    fs::create_dir_all(&directory)
        .map_err(|e| e.to_string())?;

    Ok(directory)
}

fn activity_path() -> Result<PathBuf, String> {
    Ok(app_data_dir()?.join("activity.json"))
}

pub fn load_activity() -> Result<Vec<ActivityEntry>, String> {
    let path = activity_path()?;

    if !path.exists() {
        return Ok(Vec::new());
    }

    let json = fs::read_to_string(path)
        .map_err(|e| e.to_string())?;

    if json.trim().is_empty() {
        return Ok(Vec::new());
    }

    serde_json::from_str(&json)
        .map_err(|e| e.to_string())
}

pub fn save_activity(activity: &[ActivityEntry]) -> Result<(), String> {
    let path = activity_path()?;

    let json = serde_json::to_string_pretty(activity)
        .map_err(|e| e.to_string())?;

    fs::write(path, json)
        .map_err(|e| e.to_string())
}

pub fn log_activity(entry: ActivityEntry) -> Result<(), String> {
    let mut activity = load_activity()?;

    activity.push(entry);

    save_activity(&activity)
}