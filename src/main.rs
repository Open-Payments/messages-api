use actix_files::Files;
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use messages_api::{handlers::validate::apply_logic, validate_message};

// Handler for the root path - serves our index.html
async fn index() -> impl Responder {
    HttpResponse::Ok()
        .content_type("text/html")
        .body(include_str!("../static/index.html"))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting server at http://0.0.0.0:8080");

    HttpServer::new(move || {
        App::new()
            .service(web::resource("/").to(index))
            .service(web::resource("/validate").to(validate_message))
            .service(web::resource("/apply_logic").to(apply_logic))
            .service(
                Files::new("/", "static") // Changed this line to serve from root
                    .show_files_listing()
                    .index_file("index.html"),
            )
            .wrap(actix_web::middleware::Logger::default())
            .wrap(actix_web::middleware::Compress::default())
            .wrap(
                actix_web::middleware::DefaultHeaders::new()
                    .add(("Access-Control-Allow-Origin", "*"))
                    .add(("Access-Control-Allow-Methods", "POST, GET, OPTIONS"))
                    .add(("Access-Control-Allow-Headers", "Content-Type, Message-Type")),
            )
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
