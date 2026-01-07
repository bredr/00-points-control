use crate::router::models;
use crate::router::servo::ServoControl;
use crate::router::state;
use axum::{Json, extract::State, http::status::StatusCode, response::IntoResponse};

pub async fn put_point_state(
    State(state): State<state::AppState>,
    Json(params): Json<models::UpdatePointParams>,
) -> impl IntoResponse {
    // 1. Update internal memory state
    if params.degrees < 10.0 || params.degrees > 170.0 {
        return (StatusCode::BAD_REQUEST).into_response();
    }

    state.point_state.set_point(params.id, params.degrees);

    // 2. Control Hardware
    // Lock the hardware and move the servo
    let mut pwm = state.pwm.lock().unwrap();
    if let Err(e) = pwm.move_servo(params.id, params.degrees) {
        tracing::error!("Hardware Error: {:?}", e);
    }

    (
        StatusCode::OK,
        Json(models::CurrentPointState {
            map: state.point_state.get_state(),
        }),
    )
        .into_response()
}

pub async fn get_point_state(
    State(state): State<state::AppState>,
) -> Json<models::CurrentPointState> {
    Json(models::CurrentPointState {
        map: state.point_state.get_state(),
    })
}
