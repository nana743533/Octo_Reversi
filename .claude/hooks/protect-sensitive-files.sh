#!/bin/bash
# 機密ファイルへの書き込みを保護するフック
input=$(cat)
file_path=$(echo "$input" | jq -r '.tool_input.file_path // ""')

# 保護対象パターン
protected_patterns=(
    ".env"
    ".env.local"
    ".env.production"
    ".secrets"
    "secrets/"
    "credentials"
    ".pem"
    ".key"
    ".aws/credentials"
    ".ssh/"
)

for pattern in "${protected_patterns[@]}"; do
    if [[ "$file_path" == *"$pattern"* ]]; then
        echo "{\"decision\": \"deny\", \"reason\": \"保護対象ファイルへの操作が検出されました: $pattern\"}" >&2
        exit 2
    fi
done

exit 0
