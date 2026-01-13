use crate::router::models;
use crate::router::servo;
use crate::router::servo::ServoControl;
use crate::router::state;
use axum::extract::Path;
use axum::{Json, extract::State, http::status::StatusCode, response::IntoResponse};

pub async fn get_point_state(
    State(state): State<state::AppState>,
    Path(id): Path<u8>,
) -> impl IntoResponse {
    if !servo::valid_channel(id) || !state.config.contains_key(&id) {
        return (StatusCode::BAD_REQUEST).into_response();
    }
    tracing::debug!("Get point state {}", id);
    (Json(models::PointState {
        is_straight: state.point_state.get_point(id),
    }))
    .into_response()
}

pub async fn put_point_manual_state(
    State(state): State<state::AppState>,
    Json(params): Json<models::UpdatePointManualParams>,
) -> impl IntoResponse {
    if !servo::valid_channel(params.id) || !state.config.contains_key(&params.id) {
        return (StatusCode::BAD_REQUEST).into_response();
    }
    tracing::debug!("Manually setting point {} to {}", params.id, params.degrees);
    let mut pwm = state.pwm.lock().unwrap();
    match pwm.move_servo(params.id, params.degrees) {
        Ok(_) => (
            StatusCode::OK,
            Json(models::PointStateManual {
                degrees: params.degrees,
            }),
        )
            .into_response(),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, Json(err)).into_response(),
    }
}

pub async fn put_point_state(
    State(state): State<state::AppState>,
    Json(params): Json<models::UpdatePointParams>,
) -> impl IntoResponse {
    // 1. Update internal memory state
    if !servo::valid_channel(params.id) || !state.config.contains_key(&params.id) {
        return (StatusCode::BAD_REQUEST).into_response();
    }

    state.point_state.set_point(params.id, params.is_straight);

    // 2. Control Hardware
    // Lock the hardware and move the servo
    let mut pwm = state.pwm.lock().unwrap();
    let Some(angles) = state.config.get(&params.id) else {
        return (StatusCode::BAD_REQUEST).into_response();
    };
    let degrees = match params.is_straight {
        true => angles.straight,
        false => angles.diverging,
    };
    tracing::debug!("Set point {} angle: {}", params.id, degrees);

    match pwm.move_servo(params.id, degrees) {
        Ok(_) => (
            StatusCode::OK,
            Json(models::PointState {
                is_straight: params.is_straight,
            }),
        )
            .into_response(),
        Err(err) => (StatusCode::INTERNAL_SERVER_ERROR, Json(err)).into_response(),
    }
}

pub async fn get_points_state(
    State(state): State<state::AppState>,
) -> Json<models::CurrentPointState> {
    Json(models::CurrentPointState {
        map: state.point_state.get_state(),
    })
}
