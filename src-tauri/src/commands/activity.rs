use crate::models::ActivityEntry;
use crate::services::activity::load_activity;

#[tauri::command]
pub fn get_activity() -> Result<Vec<ActivityEntry>, String> {
    load_activity()
}