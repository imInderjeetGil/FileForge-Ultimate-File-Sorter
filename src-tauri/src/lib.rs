mod commands;
mod models;
mod services;

use commands::{
    delete_rule,
    get_activity,
    get_rules,
    quick_sort,
    save_rule,
    scan_downloads,
    scan_folder_extensions,
    set_rule_enabled,
    undo_sort,
    update_rule,
};

use services::rules::load_rules;
use services::watcher::{start_enabled_watchers, AppState};

use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
    Manager,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AppState::default())

        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}))
.plugin(tauri_plugin_opener::init())
.plugin(tauri_plugin_dialog::init())

        .setup(|app| {
            // ---------------------------------
            // Start enabled Advanced Sorting rules
            // ---------------------------------
            let state = app.state::<AppState>();

            let rules =
                load_rules().map_err(std::io::Error::other)?;

            start_enabled_watchers(&state, rules)
                .map_err(std::io::Error::other)?;

            // ---------------------------------
            // System Tray
            // ---------------------------------
            let open_item = MenuItem::with_id(
                app,
                "open",
                "Open FileForge",
                true,
                None::<&str>,
            )?;

            let exit_item = MenuItem::with_id(
                app,
                "exit",
                "Exit FileForge",
                true,
                None::<&str>,
            )?;

            let menu = Menu::with_items(
                app,
                &[&open_item, &exit_item],
            )?;

            TrayIconBuilder::with_id("fileforge-tray")
                .icon(
                    app.default_window_icon()
                        .expect("default window icon not found")
                        .clone(),
                )
                .tooltip("FileForge")
                .menu(&menu)
                .on_menu_event(|app, event| {
                    match event.id().as_ref() {
                        "open" => {
                            if let Some(window) =
                                app.get_webview_window("main")
                            {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }

                        "exit" => {
                            app.exit(0);
                        }

                        _ => {}
                    }
                })
                .build(app)?;

            // ---------------------------------
            // Close window → hide to tray
            // ---------------------------------
            if let Some(window) = app.get_webview_window("main") {
    let window_for_event = window.clone();

    window.on_window_event(move |event| {
        if let tauri::WindowEvent::CloseRequested {
            api,
            ..
        } = event
        {
            api.prevent_close();

            let _ = window_for_event.hide();
        }
    });
}

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
            update_rule,
            get_activity,
        ])

        .run(tauri::generate_context!())
        .expect("error while running FileForge");
}