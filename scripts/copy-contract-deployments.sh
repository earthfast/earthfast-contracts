# Check if target repo argument is provided
if [ $# -eq 0 ]; then
  echo "Please specify target repo: cli, keeper, or all"
  exit 1
fi

target_repo="$1"
if [ "$target_repo" != "cli" ] && [ "$target_repo" != "keeper" ] && [ "$target_repo" != "dashboard" ] && [ "$target_repo" != "all" ]; then
  echo "Invalid target repo. Please specify cli, keeper, dashboard, or all"
  exit 1
fi

copy_to_repo() {
  local repo=$1
  local repo_path

  if [ "$repo" = "dashboard" ]; then
    repo_path="../../earthfast-dashboard/server"
  else
    repo_path="../../earthfast-$repo"
  fi

  for f in ../deployments/testnet-sepolia-staging/*.json; do
    jq '{address, abi}' "$f" > "$repo_path/abi/testnet-sepolia-staging/$(basename $f)"
  done

  for f in ../deployments/testnet-sepolia/*.json; do
    jq '{address, abi}' "$f" > "$repo_path/abi/testnet-sepolia/$(basename $f)"
  done
}

if [ "$target_repo" = "all" ]; then
  copy_to_repo "cli"
  copy_to_repo "keeper"
  copy_to_repo "dashboard"
else
  copy_to_repo "$target_repo"
fi
