use actix_web::{
    web::{self},
    HttpResponse, Responder,
};
use datalogic_rs::JsonLogic;
use std::thread;

use crate::{LogicEngineRequest, LogicEngineResponse};


pub async fn apply_logic(payload: web::Json<LogicEngineRequest>) -> impl Responder {
    let logic = JsonLogic::new();

    let validation_result = thread::Builder::new()
        .stack_size(16 * 1024 * 1024)
        .spawn(move || match logic.apply(&payload.rules, &payload.data) {
            Ok(result) => LogicEngineResponse::Success(result),
            Err(e) => LogicEngineResponse::Error(vec![format!("Logic evaluation error: {}", e)]),
        })
        .expect("Thread spawn failed")
        .join()
        .unwrap_or_else(|e| LogicEngineResponse::Error(vec![format!("Thread error: {:?}", e)]));

    match validation_result {
        LogicEngineResponse::Success(data) => HttpResponse::Ok().json(data),
        LogicEngineResponse::Error(errors) => HttpResponse::BadRequest().json(errors),
    }
}
