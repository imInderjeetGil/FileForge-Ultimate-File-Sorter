use crate::models::{ActivityEntry, Rule};
use crate::services::activity::log_activity;
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
    println!(
        "[FileForge] Event for rule '{}': {:?}",
        rule.rule_name,
        event.kind
    );

    match event.kind {
        EventKind::Create(_) | EventKind::Modify(_) => {
            let destination = Path::new(&rule.destination);

            for path in event.paths {
                println!(
                    "[FileForge] Detected file: {:?}",
                    path
                );

                println!(
                    "[FileForge] Rule extensions: {:?}",
                    rule.extensions
                );

                println!(
                    "[FileForge] Destination: {:?}",
                    destination
                );

                match move_matching_file(
                    &path,
                    destination,
                    &rule.extensions,
                ) {
                    Some((source, moved_to)) => {
                        println!(
                            "[FileForge] MOVED: {:?} -> {:?}",
                            source,
                            moved_to
                        );

                        let timestamp = std::time::SystemTime::now()
                            .duration_since(std::time::UNIX_EPOCH)
                            .map(|duration| duration.as_millis().to_string())
                            .unwrap_or_default();

                        let file_name = source
                            .file_name()
                            .and_then(|name| name.to_str())
                            .unwrap_or("Unknown file")
                            .to_string();

                        let activity = ActivityEntry {
                            timestamp,
                            rule_id: rule.id.clone(),
                            rule_name: rule.rule_name.clone(),
                            file_name,
                            source: source.to_string_lossy().to_string(),
                            destination: moved_to.to_string_lossy().to_string(),
                        };

                        if let Err(error) = log_activity(activity) {
                            eprintln!(
                                "Failed to log activity: {error}"
                            );
                        }
                    }

                    None => {
                        println!(
                            "[FileForge] NOT MOVED: {:?}",
                            path
                        );
                    }
                }
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
    if let Some((source, destination)) =
        move_matching_file(
            &path,
            destination,
            &rule.extensions,
        )
    {
       let timestamp = std::time::SystemTime::now()
    .duration_since(std::time::UNIX_EPOCH)
    .map(|duration| duration.as_millis().to_string())
    .unwrap_or_default();

        let file_name = source
            .file_name()
            .and_then(|name| name.to_str())
            .unwrap_or("Unknown file")
            .to_string();

        let activity = ActivityEntry {
            timestamp,
            rule_id: rule.id.clone(),
            rule_name: rule.rule_name.clone(),
            file_name,
            source: source.to_string_lossy().to_string(),
            destination: destination.to_string_lossy().to_string(),
        };

        if let Err(error) = log_activity(activity) {
            eprintln!(
                "Failed to log activity: {error}"
            );
        }
    }
}
    }

    Ok(())
}

pub fn start_watcher(state: &AppState, rule: Rule) -> Result<(), String> {
    stop_watcher(state, &rule.id)?;

    let callback_rule = rule.clone();

    // Start watching immediately so the application does not block
    // while existing files are being processed.
    let mut watcher = recommended_watcher(move |result| {
        if let Ok(event) = result {
            handle_event(event, &callback_rule);
        }
    })
    .map_err(|e| e.to_string())?;

    watcher
        .watch(
            Path::new(&rule.watch_folder),
            RecursiveMode::NonRecursive,
        )
        .map_err(|e| e.to_string())?;

    state
        .watchers
        .lock()
        .map_err(|_| "Watcher state lock failed.".to_string())?
        .insert(rule.id.clone(), watcher);

    // Process existing files in the background.
    std::thread::spawn(move || {
        if let Err(error) = process_existing_files(&rule) {
            eprintln!(
                "Failed to process existing files for rule '{}': {}",
                rule.rule_name,
                error
            );
        }
    });

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
