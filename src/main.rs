use actix_web::{web, App, HttpServer, HttpResponse, Responder};
use open_payments_fednow::FednowMessage;
use serde_xml_rs::from_str;
use std::thread;

async fn validate_message(body: String) -> impl Responder {
    let result = thread::Builder::new()
        .stack_size(16 * 1024 * 1024) // Set stack size to 16 MB
        .spawn(move || {
            let parsed: Result<FednowMessage, _> = from_str(&body);
            parsed
        })
        .expect("Thread spawn failed")
        .join();

    match result {
        // If parsing is successful, perform additional validation
        Ok(Ok(message)) => {
            // Return the message as the response
            HttpResponse::Ok().json(message)  // Parsing and validation successful
        },
        Ok(Err(e)) => HttpResponse::BadRequest().body(format!("Invalid XML: {}", e)), // XML parsing failed
        Err(e) => HttpResponse::InternalServerError().body(format!("Thread error: {:?}", e)), // Threading error
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        App::new()
            // POST route to validate XML message
            .route("/validate", web::post().to(validate_message))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}