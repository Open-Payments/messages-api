use actix_web::{web, App, HttpServer};
use messages_api::validate_message;  // Using the library

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting server at http://0.0.0.0:8080");
    HttpServer::new(move || {
        App::new()
            .route("/validate", web::post().to(validate_message))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}