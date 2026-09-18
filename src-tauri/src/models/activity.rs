use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivityEntry {
    pub timestamp: String,
    pub rule_id: String,
    pub rule_name: String,
    pub file_name: String,
    pub source: String,
    pub destination: String,
}