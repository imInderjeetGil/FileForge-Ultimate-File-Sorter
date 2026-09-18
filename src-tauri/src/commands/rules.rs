use crate::models::Rule;
use crate::services::rules::{load_rules, save_rules};
use crate::services::watcher::{start_watcher, stop_watcher, AppState};
use std::path::Path;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::State;

fn validate_rule(
    rule_name: &str,
    watch_folder: &str,
    extensions: &[String],
    destination: &str,
) -> Result<(String, String, String), String> {
    let rule_name = rule_name.trim();

    if rule_name.is_empty() {
        return Err("Rule name is required.".to_string());
    }

    if extensions.is_empty() {
        return Err("Select at least one file extension.".to_string());
    }

    let watch = Path::new(watch_folder);
    let destination_path = Path::new(destination);

    if !watch.is_dir() {
        return Err("Watch folder does not exist.".to_string());
    }

    if !destination_path.is_dir() {
        return Err("Destination folder does not exist.".to_string());
    }

    let watch_canonical = watch.canonicalize().map_err(|e| e.to_string())?;
    let destination_canonical = destination_path
        .canonicalize()
        .map_err(|e| e.to_string())?;

    if watch_canonical == destination_canonical {
        return Err("Watch folder and destination cannot be the same folder.".to_string());
    }

    Ok((
        rule_name.to_string(),
        watch_canonical.to_string_lossy().to_string(),
        destination_canonical.to_string_lossy().to_string(),
    ))
}

#[tauri::command]
pub fn get_rules() -> Result<Vec<Rule>, String> {
    load_rules()
}

#[tauri::command]
pub fn save_rule(
    rule_name: String,
    watch_folder: String,
    extensions: Vec<String>,
    destination: String,
    enabled: bool,
    state: State<AppState>,
) -> Result<Rule, String> {
    let (rule_name, watch_folder, destination) =
        validate_rule(&rule_name, &watch_folder, &extensions, &destination)?;

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|e| e.to_string())?
        .as_millis();

    let rule = Rule {
        id: format!("rule-{timestamp}"),
        rule_name,
        watch_folder,
        extensions,
        destination,
        enabled,
    };

    let mut rules = load_rules()?;
    rules.push(rule.clone());
    save_rules(&rules)?;

    if enabled {
        if let Err(error) = start_watcher(&state, rule.clone()) {
            return Err(format!(
                "Rule saved, but background watcher could not start: {error}"
            ));
        }
    }

    Ok(rule)
}

#[tauri::command]
pub fn update_rule(
    rule_id: String,
    rule_name: String,
    watch_folder: String,
    extensions: Vec<String>,
    destination: String,
    enabled: bool,
    state: State<AppState>,
) -> Result<Rule, String> {
    let (rule_name, watch_folder, destination) =
        validate_rule(&rule_name, &watch_folder, &extensions, &destination)?;

    let mut rules = load_rules()?;
    let existing = rules
        .iter()
        .find(|rule| rule.id == rule_id)
        .cloned()
        .ok_or_else(|| "Rule not found.".to_string())?;

    stop_watcher(&state, &existing.id)?;

    let updated = Rule {
        id: existing.id,
        rule_name,
        watch_folder,
        extensions,
        destination,
        enabled,
    };

    let index = rules
        .iter()
        .position(|rule| rule.id == rule_id)
        .ok_or_else(|| "Rule not found.".to_string())?;

    rules[index] = updated.clone();
    save_rules(&rules)?;

    if enabled {
        if let Err(error) = start_watcher(&state, updated.clone()) {
            return Err(format!(
                "Rule updated, but background watcher could not start: {error}"
            ));
        }
    }

    Ok(updated)
}

#[tauri::command]
pub fn set_rule_enabled(
    rule_id: String,
    enabled: bool,
    state: State<AppState>,
) -> Result<Rule, String> {
    let mut rules = load_rules()?;
    let rule = rules
        .iter_mut()
        .find(|rule| rule.id == rule_id)
        .ok_or_else(|| "Rule not found.".to_string())?;

    rule.enabled = enabled;
    let updated = rule.clone();
    save_rules(&rules)?;

    if enabled {
        start_watcher(&state, updated.clone())?;
    } else {
        stop_watcher(&state, &updated.id)?;
    }

    Ok(updated)
}

#[tauri::command]
pub fn delete_rule(
    rule_id: String,
    state: State<AppState>,
) -> Result<(), String> {
    let mut rules = load_rules()?;

    let rule = rules
        .iter()
        .find(|rule| rule.id == rule_id)
        .cloned()
        .ok_or_else(|| "Rule not found.".to_string())?;

    if rule.enabled {
        stop_watcher(&state, &rule.id)?;
    }

    rules.retain(|item| item.id != rule_id);

    save_rules(&rules)?;

    Ok(())
}

