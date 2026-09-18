use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Rule {
    pub id: String,
    pub rule_name: String,
    pub watch_folder: String,
    pub extensions: Vec<String>,
    pub destination: String,
    pub enabled: bool,
}
