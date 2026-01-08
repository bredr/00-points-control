use linux_embedded_hal;
use linux_embedded_hal::I2cdev;
use pwm_pca9685::{Channel, Pca9685};
/// Set based on calibration
/// Minimum pulse length (approx 0 degrees)
const SERVO_MIN: f32 = 102.0;
/// Maximum pulse length (approx 180 degrees)
const SERVO_MAX: f32 = 532.0;

pub trait ServoControl {
    fn move_servo(&mut self, id: u8, degrees: f32) -> Result<(), &'static str>;
}
impl ServoControl for Pca9685<I2cdev> {
    fn move_servo(&mut self, id: u8, degrees: f32) -> Result<(), &'static str> {
        let pulse = map_angle_to_pulse(degrees, SERVO_MIN, SERVO_MAX);
        let result: Result<(), &'static str> = match map_channel(id) {
            Some(channel) => {
                if let Err(e) = self.set_channel_on_off(channel, 0, pulse.round() as u16) {
                    tracing::error!("Hardware Error: {:?}", e);
                    return Err("Hardware Error");
                } else {
                    return Ok(());
                }
            }
            None => Err("Unknown channel"),
        };

        // In v0.1, this is a synchronous call
        tracing::debug!("channel {:?}, result {:?}", id, result);
        result
    }
}

fn map_angle_to_pulse(angle: f32, servomin: f32, servomax: f32) -> f32 {
    let angle = angle.clamp(10.0, 170.0); // Clamp to 170 to stop hitting jitter
    servomin + (angle / 180.0) * (servomax - servomin)
}

pub fn valid_channel(id: u8) -> bool {
    match map_channel(id) {
        Some(_) => true,
        None => false,
    }
}

fn map_channel(id: u8) -> Option<Channel> {
    match id {
        0 => Some(Channel::C0),
        1 => Some(Channel::C1),
        2 => Some(Channel::C2),
        3 => Some(Channel::C3),
        4 => Some(Channel::C4),
        5 => Some(Channel::C5),
        6 => Some(Channel::C6),
        7 => Some(Channel::C7),
        8 => Some(Channel::C8),
        9 => Some(Channel::C9),
        10 => Some(Channel::C10),
        11 => Some(Channel::C11),
        12 => Some(Channel::C12),
        13 => Some(Channel::C13),
        14 => Some(Channel::C14),
        15 => Some(Channel::C15),
        _ => None, // Default or handle error
    }
}
