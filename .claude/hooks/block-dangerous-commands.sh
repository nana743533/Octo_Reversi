#!/bin/bash
# 危険なコマンドをブロックするフック
# stdinからJSONを読み取り
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // ""')

# 危険なコマンドパターン
dangerous_patterns=(
    "rm -rf /"
    "rm -rf ~"
    "rm -rf \."
    ":(){:|:&};:"
    "mkfs"
    "dd if=/dev/zero"
    "dd if=/dev/random"
    "> /dev/sda"
    "format"
)

for pattern in "${dangerous_patterns[@]}"; do
    if [[ "$command" == *"$pattern"* ]]; then
        echo "{\"decision\": \"deny\", \"reason\": \"危険なコマンドパターンを検出: $pattern\"}" >&2
        exit 2
    fi
done

exit 0
