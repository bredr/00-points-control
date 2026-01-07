use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct UpdatePointParams {
    pub id: u8,
    pub degrees: f32,
}

#[derive(Debug, Clone, Serialize)]
pub struct CurrentPointState {
    pub map: HashMap<u8, f32>,
}
