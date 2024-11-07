#!/usr/bin/env bash

if ! command -v abigen &> /dev/null; then
    echo "abigen could not be found"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo "jq could not be found"
    exit 1
fi

for contract in nodes projects registry reservations; do
    CONTRACT_UPPER="$(tr '[:lower:]' '[:upper:]' <<<"${contract:0:1}")${contract:1}"
    jq '.abi' "../deployments/testnet-sepolia/Earthfast$CONTRACT_UPPER.json" | abigen --abi=- --pkg=$contract --out="../../earthfast-services/src/contracts/$contract/$contract.go"
  done
