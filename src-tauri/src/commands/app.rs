use std::path::PathBuf;
use std::process::Command;

#[tauri::command]
pub fn open_downloads_folder() -> Result<(), String> {
    let profile =
        std::env::var("USERPROFILE").map_err(|e| e.to_string())?;

    let downloads = PathBuf::from(profile).join("Downloads");

    if !downloads.is_dir() {
        return Err("Downloads folder does not exist.".to_string());
    }

    Command::new("explorer.exe")
        .arg(downloads)
        .spawn()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn exit_app(app: tauri::AppHandle) {
    app.exit(0);
}