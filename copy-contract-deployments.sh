# copy to cli
for f in deployments/testnet-sepolia-staging/*.json; do
  jq '{address, abi}' "$f" > "../earthfast-cli/abi/testnet-sepolia-staging/$(basename $f)"
done

for f in deployments/testnet-sepolia/*.json; do
  jq '{address, abi}' "$f" > "../earthfast-cli/abi/testnet-sepolia/$(basename $f)"
done

# copy to keeper
for f in deployments/testnet-sepolia-staging/*.json; do
  jq '{address, abi}' "$f" > "../earthfast-keeper/abi/testnet-sepolia-staging/$(basename $f)"
done

for f in deployments/testnet-sepolia/*.json; do
  jq '{address, abi}' "$f" > "../earthfast-keeper/abi/testnet-sepolia/$(basename $f)"
done
