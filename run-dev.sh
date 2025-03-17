#!/bin/bash

export HOST_UID=$(id -u)
export HOST_GID=$(id -g)

run_compose() {
  docker compose -f docker-compose.dev.yml "$@"
}

cleanup() {
  run_compose down
}

trap cleanup EXIT

filter_ansi_except_colors() {
  sed -u 's/\x1b\[[0-9;]*[a-ln-zA-Z]//g'
}

run_compose up | filter_ansi_except_colors
