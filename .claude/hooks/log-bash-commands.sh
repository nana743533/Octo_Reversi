#!/bin/bash
# Bashコマンドをログに記録するフック
log_file="$HOME/.claude/bash-command-log.txt"
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // "N/A"')
description=$(echo "$input" | jq -r '.tool_input.description // "No description"')
timestamp=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$timestamp] $command - $description" >> "$log_file"
exit 0
