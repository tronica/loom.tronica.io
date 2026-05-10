#!/bin/bash
set -e

REPO_DIR="/tmp/loom-workspaces/repo"
cd "$REPO_DIR"

# Read current count
COUNT=$(jq '.count' _data/counter.json)
NEW_COUNT=$((COUNT + 1))

# Update counter
jq ".count = $NEW_COUNT" _data/counter.json > _data/counter.json.tmp
mv _data/counter.json.tmp _data/counter.json

# Rebuild
npm run build

# Commit and push
git add -A
git commit -m "chore: increment counter to $NEW_COUNT"
git push

# Deploy
deployStatic source="_site" environment="prod"

echo "Counter incremented to $NEW_COUNT and deployed"
