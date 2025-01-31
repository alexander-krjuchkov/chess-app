#!/bin/bash

docker compose -f docker-compose.testing.yml up \
  --build \
  --force-recreate \
  --exit-code-from tester
exit_code=$?

docker compose -f docker-compose.testing.yml down --remove-orphans

exit $exit_code
