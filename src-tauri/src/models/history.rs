use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct FileMove {
    pub from: String,
    pub to: String,
}

#[derive(Debug, Serialize, Deserialize, Default)]
pub struct SortHistory {
    #[serde(default)]
    pub moves: Vec<FileMove>,
    #[serde(default)]
    pub created_folders: Vec<String>,
}
