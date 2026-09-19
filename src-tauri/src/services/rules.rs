use crate::models::Rule;
use std::fs;
use std::path::PathBuf;

fn normalize_windows_path(path: &str) -> String {
    if let Some(rest) = path.strip_prefix(r"\\?\UNC\") {
        return format!(r"\\{}", rest);
    }

    if let Some(rest) = path.strip_prefix(r"\\?\") {
        return rest.to_string();
    }

    path.to_string()
}

pub fn rules_path() -> Result<PathBuf, String> {
    let app_data = std::env::var("APPDATA").map_err(|e| e.to_string())?;
    let dir = PathBuf::from(app_data).join("FileForge");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    Ok(dir.join("rules.json"))
}

pub fn load_rules() -> Result<Vec<Rule>, String> {
    let path = rules_path()?;

    if !path.exists() {
        return Ok(Vec::new());
    }

    let json = fs::read_to_string(&path)
        .map_err(|e| e.to_string())?;

    if json.trim().is_empty() {
        return Ok(Vec::new());
    }

    let mut rules: Vec<Rule> =
        serde_json::from_str(&json)
            .map_err(|e| e.to_string())?;

    let mut changed = false;

    for rule in &mut rules {
        let watch_folder =
            normalize_windows_path(&rule.watch_folder);

        let destination =
            normalize_windows_path(&rule.destination);

        if rule.watch_folder != watch_folder {
            rule.watch_folder = watch_folder;
            changed = true;
        }

        if rule.destination != destination {
            rule.destination = destination;
            changed = true;
        }
    }

    if changed {
        save_rules(&rules)?;
    }

    Ok(rules)
}

pub fn save_rules(rules: &[Rule]) -> Result<(), String> {
    let path = rules_path()?;
    let json = serde_json::to_string_pretty(rules).map_err(|e| e.to_string())?;
    fs::write(path, json).map_err(|e| e.to_string())
}
