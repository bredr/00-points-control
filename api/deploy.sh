#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail
set -o xtrace

export TARGET_HOST="${TARGET_HOST:-pi@raspberrypi.local}"
export TARGET_PATH="${TARGET_PATH:-/home/pi/bin/}"
readonly TARGET=aarch64-unknown-linux-gnu
readonly SOURCE_PATH=./target/${TARGET}/release/

cargo zigbuild --target ${TARGET} --release
rsync -a ${SOURCE_PATH} ${TARGET_HOST}:${TARGET_PATH}
