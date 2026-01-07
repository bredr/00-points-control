use linux_embedded_hal;
use linux_embedded_hal::I2cdev;
use pwm_pca9685::{Channel, Error as PcaError, Pca9685};
/// Set based on calibration
/// Minimum pulse length (approx 0 degrees)
const SERVO_MIN: f32 = 102.0;
/// Maximum pulse length (approx 180 degrees)
const SERVO_MAX: f32 = 532.0;

pub trait ServoControl {
    fn move_servo(
        &mut self,
        id: u8,
        degrees: f32,
    ) -> Result<(), PcaError<linux_embedded_hal::i2cdev::linux::LinuxI2CError>>;
}
impl ServoControl for Pca9685<I2cdev> {
    fn move_servo(
        &mut self,
        id: u8,
        degrees: f32,
    ) -> Result<(), PcaError<linux_embedded_hal::i2cdev::linux::LinuxI2CError>> {
        let pulse = map_angle_to_pulse(degrees, SERVO_MIN, SERVO_MAX);
        let channel = map_channel(id);

        // In v0.1, this is a synchronous call
        let result = self.set_channel_on_off(channel, 0, pulse.round() as u16);
        tracing::debug!("channel {:?}, result {:?}", channel, result);
        result
    }
}

fn map_angle_to_pulse(angle: f32, servomin: f32, servomax: f32) -> f32 {
    let angle = angle.clamp(10.0, 170.0); // Clamp to 170 to stop hitting jitter
    servomin + (angle / 180.0) * (servomax - servomin)
}

fn map_channel(id: u8) -> Channel {
    match id {
        0 => Channel::C0,
        1 => Channel::C1,
        2 => Channel::C2,
        3 => Channel::C3,
        4 => Channel::C4,
        5 => Channel::C5,
        6 => Channel::C6,
        7 => Channel::C7,
        8 => Channel::C8,
        _ => panic!("unknown channel"), // Default or handle error
    }
}
