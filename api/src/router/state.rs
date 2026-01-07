use linux_embedded_hal::I2cdev;
use pwm_pca9685::Pca9685;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct AppState {
    pub point_state: Arc<InMemoryPointState>,
    // Pca9685<I2cdev> is the concrete type for the driver
    pub pwm: Arc<Mutex<Pca9685<I2cdev>>>,
}

#[derive(Debug, Clone, Default)]
pub struct InMemoryPointState {
    map: Arc<Mutex<HashMap<u8, f32>>>,
}

impl InMemoryPointState {
    pub fn set_point(&self, id: u8, degrees: f32) {
        self.map.lock().unwrap().insert(id, degrees);
    }
    pub fn get_state(&self) -> HashMap<u8, f32> {
        self.map.lock().unwrap().clone()
    }
}
