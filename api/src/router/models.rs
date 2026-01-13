use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Deserialize)]
pub struct UpdatePointParams {
    pub id: u8,
    pub is_straight: bool,
}

#[derive(Deserialize)]
pub struct UpdatePointManualParams {
    pub id: u8,
    pub degrees: f32,
}

#[derive(Debug, Clone, Serialize)]
pub struct CurrentPointState {
    pub map: HashMap<u8, bool>,
}

#[derive(Debug, Clone, Serialize)]
pub struct PointState {
    pub is_straight: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct PointStateManual {
    pub degrees: f32,
}
