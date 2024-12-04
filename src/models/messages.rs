use open_payments_common::ValidationError;
use open_payments_iso20022::document::Document;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize)]
#[serde(untagged)]
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
pub struct LogicEngineRequest {
    pub rules: Value,
    pub data: Value,
}

#[derive(Serialize)]
#[serde(untagged)]
pub enum LogicEngineResponse {
    Success(serde_json::Value),
    Error(Vec<String>),
}
