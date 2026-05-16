#!/bin/sh
set -e
cd "$(dirname "$0")"

./mvnw -B -q -DskipTests package
exec java -jar "target/tictactoe-backend.jar" "$@"
