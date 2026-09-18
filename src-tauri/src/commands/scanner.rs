use serde::Serialize;
use std::collections::HashMap;
use std::path::PathBuf;

#[derive(Serialize)]
pub struct ExtensionInfo {
    pub extension: String,
    pub count: usize,
}

#[tauri::command]
pub fn scan_folder_extensions(folder: String) -> Result<Vec<ExtensionInfo>, String> {
    let path = PathBuf::from(folder);
    if !path.exists() || !path.is_dir() {
        return Err("Selected path is not a folder.".to_string());
    }

    let mut extensions = HashMap::<String, usize>::new();
    for entry in std::fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let file_path = entry.path();
        if !file_path.is_file() {
            continue;
        }

        if let Some(ext) = file_path.extension().and_then(|e| e.to_str()) {
            let ext = format!(".{ext}").to_lowercase();
            *extensions.entry(ext).or_insert(0) += 1;
        }
    }

    let mut result: Vec<ExtensionInfo> = extensions
        .into_iter()
        .map(|(extension, count)| ExtensionInfo { extension, count })
        .collect();

    result.sort_by(|a, b| a.extension.cmp(&b.extension));
    Ok(result)
}
