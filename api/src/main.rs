use axum::{
    Router,
    routing::{get, put},
};
use linux_embedded_hal::I2cdev;
use pwm_pca9685::{Pca9685, SlaveAddr};
use std::{
    path::Path,
    sync::{Arc, Mutex},
};
use tokio::net::TcpListener;
use tower_http::services::{ServeDir, ServeFile};

mod config;
mod router;
use crate::router::state;
use crate::router::{handlers, servo::ServoControl};
use std::env;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let args: Vec<String> = env::args().collect();
    let config_path = &args[1];

    let loaded_config = match config::Config::load(Path::new(config_path)) {
        Err(err) => {
            tracing::error!("Unable to load config: {:?}", err);
            panic!("Unable to load config");
        }
        Ok(config) => config,
    };

    tracing::debug!("Config: {:?}", loaded_config);

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

    for (id, is_straight, degrees) in loaded_config.get_defaults() {
        if let Err(err) = shared_pwm
            .lock()
            .expect("Unable to lock pwm")
            .move_servo(id.clone(), degrees.clone())
        {
            tracing::error!("Error initialising point {}: {}", id, err);
        } else {
            tracing::debug!("Initialised point {} to {}", id, degrees);
        }
        point_state.set_point(id.clone(), is_straight.clone());
    }

    let serve_dir = ServeDir::new("dist").not_found_service(ServeFile::new("dist/index.html"));
    let app = Router::new()
        .route("/api/points", get(handlers::get_points_state))
        .route("/api/point", put(handlers::put_point_state))
        .route("/api/point/manual", put(handlers::put_point_manual_state))
        .route("/api/point/{id}", get(handlers::get_point_state))
        .fallback_service(serve_dir)
        .with_state(state::AppState {
            point_state,
            pwm: shared_pwm,
            config: loaded_config.to_lookup(),
        });

    let port = match std::env::var("PORT") {
        Ok(port) => port,
        Err(_) => "3000".to_string(),
    };

    let listener = TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    tracing::info!("Server running on http://localhost:{}", port);
    axum::serve(listener, app).await.unwrap();
}
