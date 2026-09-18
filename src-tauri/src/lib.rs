mod commands;
mod models;
mod services;

use commands::{
    delete_rule,
    get_rules,
    quick_sort,
    save_rule,
    scan_downloads,
    scan_folder_extensions,
    set_rule_enabled,
    undo_sort,
};
use services::rules::load_rules;
use services::watcher::{start_enabled_watchers, AppState};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState::default())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let state = app.state::<AppState>();
            let rules = load_rules().map_err(std::io::Error::other)?;
            start_enabled_watchers(&state, rules).map_err(std::io::Error::other)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
    scan_downloads,
    quick_sort,
    undo_sort,
    scan_folder_extensions,
    get_rules,
    save_rule,
    set_rule_enabled,
    delete_rule,
])
        .run(tauri::generate_context!())
        .expect("error while running FileForge");
}
