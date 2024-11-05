use serde::{Deserialize, Serialize};
use open_payments_iso20022::document::Document;

#[derive(Serialize)]
#[serde(untagged)]  // This makes the JSON output cleaner without the enum variant name
pub enum ValidationResponse {
    Success(serde_json::Value),
    Error(Vec<String>),
}

#[derive(Serialize, Deserialize)]
#[serde(rename = "Document")]
pub struct ISO20022Message {
    #[serde(rename( deserialize = "$value" ))]
    pub document: Document,
}