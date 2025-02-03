#!/bin/bash

suites=(
  'main'
  'timeout'
)

total_failures=0

for suite in "${suites[@]}"; do
  echo
  echo "============================================================="
  echo "                  Running suite: $suite"
  echo "============================================================="
  echo

  SUITE="$suite" \
    docker compose -f docker-compose.testing.yml up \
    --build \
    --force-recreate \
    --exit-code-from tester
  exit_code=$?

  SUITE="$suite" \
    docker compose -f docker-compose.testing.yml down --remove-orphans

  if [ $exit_code -eq 0 ]; then
    echo
    echo "Suite $suite: ✅ PASSED"
    echo
  else
    echo
    echo "Suite $suite: ❌ FAILED"
    echo
    ((total_failures++))
  fi
done

if [ $total_failures -eq 0 ]; then
  echo
  echo "✅ All test cases passed!"
  exit 0
else
  echo
  echo "❌ Total failed cases: $total_failures"
  exit 1
fi
