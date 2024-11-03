use serde::{Deserialize, Serialize};
use open_payments_iso20022::document::Document;

#[derive(Serialize)]
pub struct ValidationResponse {
    pub is_valid: bool,
    pub parsed_data: Option<serde_json::Value>,
    pub errors: Vec<String>,
}

#[derive(Serialize, Deserialize)]
#[serde(rename = "Document")]
pub struct ISO20022Message {
    #[serde(rename( deserialize = "$value" ))]
    pub document: Document,
}