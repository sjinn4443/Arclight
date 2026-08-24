#!/bin/sh
set -eu

umask 077
mkdir -p "${REPORT_OUTPUT_DIR:-/data/reports}"
chown arclight:arclight "${REPORT_OUTPUT_DIR:-/data/reports}"
exec gosu arclight python -m arclight_reporting

