use crate::config::Angles;
use linux_embedded_hal::I2cdev;
use pwm_pca9685::Pca9685;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct AppState {
    pub point_state: Arc<InMemoryPointState>,
    // Pca9685<I2cdev> is the concrete type for the driver
    pub pwm: Arc<Mutex<Pca9685<I2cdev>>>,
    pub config: HashMap<u8, Angles>,
}

#[derive(Debug, Clone, Default)]
pub struct InMemoryPointState {
    map: Arc<Mutex<HashMap<u8, bool>>>,
}

impl InMemoryPointState {
    pub fn set_point(&self, id: u8, is_straight: bool) {
        self.map.lock().unwrap().insert(id, is_straight);
    }
    pub fn get_state(&self) -> HashMap<u8, bool> {
        self.map.lock().unwrap().clone()
    }

    pub fn get_point(&self, id: u8) -> bool {
        self.map.lock().unwrap().get(&id).unwrap().clone()
    }
}
