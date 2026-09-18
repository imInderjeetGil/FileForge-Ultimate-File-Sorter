use crate::models::Rule;
use crate::services::file_manager::move_matching_file;
use notify::{recommended_watcher, Event, EventKind, RecursiveMode, Watcher};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::sync::Mutex;

pub struct AppState {
    pub watchers: Mutex<HashMap<String, notify::RecommendedWatcher>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            watchers: Mutex::new(HashMap::new()),
        }
    }
}

fn handle_event(event: Event, rule: &Rule) {
    match event.kind {
        EventKind::Create(_) | EventKind::Modify(_) => {
            let destination = Path::new(&rule.destination);
            for path in event.paths {
                move_matching_file(&path, destination, &rule.extensions);
            }
        }
        _ => {}
    }
}

fn process_existing_files(rule: &Rule) -> Result<(), String> {
    let watch_folder = Path::new(&rule.watch_folder);
    let destination = Path::new(&rule.destination);

    let entries = fs::read_dir(watch_folder).map_err(|e| e.to_string())?;

    for entry in entries {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        // Advanced Sorting only works on files directly inside the watch folder.
        if path.is_file() {
            move_matching_file(&path, destination, &rule.extensions);
        }
    }

    Ok(())
}

pub fn start_watcher(state: &AppState, rule: Rule) -> Result<(), String> {
    stop_watcher(state, &rule.id)?;

    // Process files that were already present before the watcher started.
    process_existing_files(&rule)?;

    let callback_rule = rule.clone();
    let mut watcher = recommended_watcher(move |result| {
        if let Ok(event) = result {
            handle_event(event, &callback_rule);
        }
    })
    .map_err(|e| e.to_string())?;

    watcher
        .watch(Path::new(&rule.watch_folder), RecursiveMode::NonRecursive)
        .map_err(|e| e.to_string())?;

    state
        .watchers
        .lock()
        .map_err(|_| "Watcher state lock failed.".to_string())?
        .insert(rule.id, watcher);

    Ok(())
}

pub fn stop_watcher(state: &AppState, rule_id: &str) -> Result<(), String> {
    state
        .watchers
        .lock()
        .map_err(|_| "Watcher state lock failed.".to_string())?
        .remove(rule_id);
    Ok(())
}

pub fn start_enabled_watchers(state: &AppState, rules: Vec<Rule>) -> Result<(), String> {
    for rule in rules.into_iter().filter(|rule| rule.enabled) {
        start_watcher(state, rule)?;
    }
    Ok(())
}
