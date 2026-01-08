use serde::{Deserialize, Serialize};
use serde_yml;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Angles {
    pub straight: f32,
    pub diverging: f32,
    pub default: f32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Point {
    pub id: u8,
    pub angles: Angles,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Config {
    points: Vec<Point>,
}

impl Config {
    pub fn load<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn std::error::Error>> {
        let raw: String = fs::read_to_string(path)?;
        let config: Config = serde_yml::from_str(&raw)?;
        Ok(config)
    }

    pub fn to_lookup(&self) -> HashMap<u8, Angles> {
        HashMap::from_iter(self.points.iter().map(|x| (x.id, x.angles.clone())))
    }

    pub fn get_defaults(&self) -> Vec<(u8, bool, f32)> {
        self.points
            .iter()
            .map(|x| {
                (
                    x.id,
                    x.angles.default == x.angles.straight,
                    x.angles.default,
                )
            })
            .collect()
    }
}
