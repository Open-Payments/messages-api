use actix_web::{web, App, HttpServer, HttpResponse, Responder, HttpRequest};
use payment_message::FednowMessage;
use payment_message::message::fednow::fednow_incoming_external::FedNowIncoming;
use payment_message::message::fednow::fednow_outgoing_external::FedNowOutgoing;
use serde_xml_rs::from_str;
use std::thread;
use serde_valid::Validate;
use utoipa::{OpenApi};

// Ensure that all related structs derive ToSchema
#[derive(OpenApi)]
#[openapi(
    paths(
        validate_message
    ),
    components(schemas(FednowMessage, FedNowIncoming, FedNowOutgoing)),  // Include all necessary schemas
    tags((name = "Validation API", description = "API to validate XML FedNow messages"))
)]
struct ApiDoc;

#[utoipa::path(
    post,
    path = "/validate",  // Define the path
    request_body(content = String, description = "XML message body", content_type = "application/xml"),
    responses(
        (status = 200, description = "Validation successful, returns valid JSON", body = FednowMessage),
        (status = 400, description = "Validation failed or Invalid XML", body = String),
        (status = 500, description = "Internal server error", body = String)
    ),
    tag = "Validation API"
)]
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
            if let Err(validation_errors) = message.validate() {
                return HttpResponse::BadRequest().body(format!("Validation failed: {:?}", validation_errors));
            }
            // Return the message as the response
            HttpResponse::Ok().json(message)  // Parsing and validation successful
        },
        Ok(Err(e)) => HttpResponse::BadRequest().body(format!("Invalid XML: {}", e)), // XML parsing failed
        Err(e) => HttpResponse::InternalServerError().body(format!("Thread error: {:?}", e)), // Threading error
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let openapi = ApiDoc::openapi(); // Generate the OpenAPI spec

    HttpServer::new(move || {
        let openapi_clone = openapi.clone(); // Clone the OpenAPI spec outside the closure

        App::new()
            // Serve the OpenAPI JSON
            .route("/openapi.json", web::get().to(move |_req: HttpRequest| {
                let openapi_data = openapi_clone.clone();
                async move {
                    HttpResponse::Ok().json(openapi_data)
                }
            }))
            // Serve the Swagger UI HTML page
            .route("/docs", web::get().to(|_req: HttpRequest| async {
                HttpResponse::Ok()
                    .content_type("text/html")
                    .body(
                        r#"
                        <!doctype html> <!-- Important: must specify -->
                        <html>
                        <head>
                            <meta charset="utf-8"> <!-- Important: rapi-doc uses utf8 characters -->
                            <script type="module" src="https://unpkg.com/rapidoc/dist/rapidoc-min.js"></script>
                        </head>
                        <body>
                            <rapi-doc
                            spec-url = "/openapi.json"
                            > </rapi-doc>
                        </body>
                        </html>
                        "#
                    )
            }))
            // POST route to validate XML message
            .route("/validate", web::post().to(validate_message))
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}