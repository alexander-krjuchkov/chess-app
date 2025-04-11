#!/bin/sh
set -e

./node_modules/.bin/typeorm migration:run -d ./dist/orm-data-source.js

exec "$@"
