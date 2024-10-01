use actix_web::{web, App, HttpServer, HttpResponse, Responder};
use payment_message::FednowMessage;
use serde_xml_rs::from_str;
use std::thread;
use serde_valid::Validate;

async fn validate_message(body: String) -> impl Responder {
    // Spawn a new thread with increased stack size for large/deep XML messages
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
            if let Err(validation_errors) = message.validate() {
                return HttpResponse::BadRequest().body(format!("Validation failed: {:?}", validation_errors));
            }
            HttpResponse::Ok().json(message)  // Parsing and validation successful
        },
        Ok(Err(e)) => HttpResponse::BadRequest().body(format!("Invalid XML: {}", e)), // XML parsing failed
        Err(e) => HttpResponse::InternalServerError().body(format!("Thread error: {:?}", e)), // Threading error
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/validate", web::post().to(validate_message)) // POST route to validate XML message
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}