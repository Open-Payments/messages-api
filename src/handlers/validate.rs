use actix_web::{HttpResponse, Responder, HttpRequest};
use open_payments_fednow::FednowMessage;
use serde_xml_rs::from_str;
use xml::reader::EventReader;
use std::io::BufReader;
use std::thread;

use crate::models::messages::{ValidationResponse, ISO20022Message};

pub async fn validate_message(
    req: HttpRequest,
    body: String,
) -> impl Responder {
    let message_type = req
        .headers()
        .get("Message-Type")
        .and_then(|h| h.to_str().ok())
        .unwrap_or("")
        .to_string();

    let validation_result = thread::Builder::new()
        .stack_size(16 * 1024 * 1024)
        .spawn(move || {
            match message_type.as_str() {
                "fednow" => handle_fednow(&body),
                "iso20022" => handle_iso20022(&body),
                _ => ValidationResponse {
                    is_valid: false,
                    parsed_data: None,
                    errors: vec![format!("Unsupported or missing message type: {}", message_type)],
                },
            }
        })
        .expect("Thread spawn failed")
        .join()
        .unwrap_or_else(|e| ValidationResponse {
            is_valid: false,
            parsed_data: None,
            errors: vec![format!("Thread error: {:?}", e)],
        });

    if validation_result.is_valid {
        HttpResponse::Ok().json(validation_result)
    } else {
        HttpResponse::BadRequest().json(validation_result)
    }
}

fn handle_fednow(body: &str) -> ValidationResponse {
    let parsed: Result<FednowMessage, _> = from_str(body);
    match parsed {
        Ok(message) => ValidationResponse {
            is_valid: true,
            parsed_data: Some(serde_json::to_value(message).unwrap()),
            errors: vec![],
        },
        Err(e) => ValidationResponse {
            is_valid: false,
            parsed_data: None,
            errors: vec![format!("FedNow parsing error: {}", e)],
        },
    }
}

fn handle_iso20022(body: &str) -> ValidationResponse {
    let reader = BufReader::new(body.as_bytes());
    let event_reader = EventReader::new(reader);
    let mut deserializer = serde_xml_rs::Deserializer::new(event_reader);
    
    let result: Result<ISO20022Message, serde_path_to_error::Error<serde_xml_rs::Error>> = 
        serde_path_to_error::deserialize(&mut deserializer);

    match result {
        Ok(message) => ValidationResponse {
            is_valid: true,
            parsed_data: Some(serde_json::to_value(message).unwrap()),
            errors: vec![],
        },
        Err(e) => ValidationResponse {
            is_valid: false,
            parsed_data: None,
            errors: vec![
                format!("ISO20022 parsing error at path: {}", e.path()),
                format!("Error details: {}", e),
            ],
        },
    }
}