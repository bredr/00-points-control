use axum::{
    Router,
    routing::{get, put},
};
use linux_embedded_hal::I2cdev;
use pwm_pca9685::{Pca9685, SlaveAddr};
use std::sync::{Arc, Mutex};
use tokio::net::TcpListener;
mod router;
use crate::router::handlers;
use crate::router::state;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // 1. Initialize Hardware
    tracing::debug!("Initializing hardware");
    let dev = I2cdev::new("/dev/i2c-1").expect("Failed to open I2C bus");
    let address = SlaveAddr::default();
    let mut pwm = Pca9685::new(dev, address);
    pwm.set_prescale(121).expect("Failed to set frequency");
    pwm.enable().unwrap();

    tracing::debug!("Enabled Pca9685");

    // 2. Wrap hardware and state for thread-safe sharing
    // We use Mutex because hardware access must be sequential
    let shared_pwm = Arc::new(Mutex::new(pwm));
    let point_state = Arc::new(state::InMemoryPointState::default());

    let app = Router::new()
        .route("/points", get(handlers::get_point_state))
        .route("/points", put(handlers::put_point_state))
        .with_state(state::AppState {
            point_state,
            pwm: shared_pwm,
        });

    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    tracing::info!("Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}
