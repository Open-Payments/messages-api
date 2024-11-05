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
                _ => ValidationResponse::Error(vec![
                    format!("Unsupported or missing message type: {}", message_type)
                ]),
            }
        })
        .expect("Thread spawn failed")
        .join()
        .unwrap_or_else(|e| ValidationResponse::Error(
            vec![format!("Thread error: {:?}", e)]
        ));

    match validation_result {
        ValidationResponse::Success(data) => HttpResponse::Ok().json(data),
        ValidationResponse::Error(errors) => HttpResponse::BadRequest().json(errors),
    }
}

fn handle_fednow(body: &str) -> ValidationResponse {
    match from_str::<FednowMessage>(body) {
        Ok(message) => ValidationResponse::Success(
            serde_json::to_value(message).unwrap()
        ),
        Err(e) => ValidationResponse::Error(
            vec![format!("FedNow parsing error: {}", e)]
        ),
    }
}

fn handle_iso20022(body: &str) -> ValidationResponse {
    let reader = BufReader::new(body.as_bytes());
    let event_reader = EventReader::new(reader);
    let mut deserializer = serde_xml_rs::Deserializer::new(event_reader);
    
    match serde_path_to_error::deserialize::<_, ISO20022Message>(&mut deserializer) {
        Ok(message) => ValidationResponse::Success(
            serde_json::to_value(message).unwrap()
        ),
        Err(e) => ValidationResponse::Error(vec![
            format!("ISO20022 parsing error at path: {}", e.path()),
            format!("Error details: {}", e),
        ]),
    }
}