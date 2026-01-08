#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail
set -o xtrace

export TARGET_HOST="${TARGET_HOST:-pi@raspberrypi.local}"
export TARGET_PATH="${TARGET_PATH:-/home/pi/bin/}"
export SOURCE_CONFIG_PATH="${SOURCE_CONFIG_PATH:-./configs/default.yaml}"
readonly TARGET=aarch64-unknown-linux-gnu
readonly SOURCE_PATH=./target/${TARGET}/release/
readonly TARGET_CONFIG_PATH=${TARGET_PATH}config.yaml

cargo zigbuild --target ${TARGET} --release
rsync -a ${SOURCE_PATH} ${TARGET_HOST}:${TARGET_PATH}
(cd ../app && npm run build)
rsync -a ./dist ${TARGET_HOST}:${TARGET_PATH}
rsync ${SOURCE_CONFIG_PATH} ${TARGET_HOST}:${TARGET_CONFIG_PATH}
