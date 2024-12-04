use open_payments_common::ValidationError;
use open_payments_iso20022::document::Document;
use serde::{Deserialize, Serialize};
use serde_json::Value;
#[derive(Serialize)]
#[serde(untagged)] // This makes the JSON output cleaner without the enum variant name
pub enum ValidationResponse {
    Success(serde_json::Value),
    Error(Vec<String>),
}

#[derive(Serialize, Deserialize)]
#[serde(rename = "Document")]
pub struct ISO20022Message {
    #[serde(rename(deserialize = "$value"))]
    pub document: Document,
}

impl ISO20022Message {
    pub fn validate(&self) -> Result<(), ValidationError> {
        self.document.validate()?;
        Ok(())
    }
}
#[derive(Deserialize)]
pub struct LogicRequest {
    pub rules: Value,
    pub data: Value,
}

#[derive(Serialize)]
pub struct LogicResponse {
    pub result: Value,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}
