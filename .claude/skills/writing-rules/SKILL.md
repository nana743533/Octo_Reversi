---
name: writing-rules
description: フックルールの作成支援。
tools: Read, Glob, Grep, Bash
---

# フックルールの作成

## 概要
ユーザーが「フックルールを作成」「フックを設定」などと要求したとき、またはhookifyの構文やパターンについてガイダンスが必要なときに使用。
フックルールは、監視するパターンと、それが一致したときに表示するメッセージを定義するマークダウンファイルです。ルールは `.claude/hooks/` ディレクトリに保存されます。

## 基本構造

### シェルスクリプト形式のフック

```bash
#!/bin/bash
# フックの説明

# 実行するコマンド
afplay /System/Library/Sounds/Glass.aiff 2>/dev/null &
```

### イベントベースのフック（JSON設定）

`.claude/settings.json` で設定:

```json
{
  "hooks": {
    "preToolUse": {
      "Edit": [
        {
          "pattern": "\\.env$",
          "message": ".envファイルを編集しようとしています。続行しますか？"
        }
      ]
    },
    "postToolUse": {
      "Edit": [
        {
          "pattern": "\\.(ts|tsx|js|jsx)$",
          "command": "npx prettier --write $FILE_PATH"
        }
      ]
    }
  }
}
```

## フックのタイミング

| タイミング | 説明 | 使用例 |
|-----------|------|--------|
| `preToolUse` | ツール実行前 | 確認プロンプト、ブロックルール |
| `postToolUse` | ツール実行後 | フォーマット、リント、通知 |
| `response-complete` | レスポンス完了後 | 通知音、サマリー |

## よく使うパターン

### ファイル編集のブロック

```json
{
  "hooks": {
    "preToolUse": {
      "Edit": [
        {
          "pattern": "(package-lock\\.json|yarn\\.lock)",
          "message": "ロックファイルの編集はブロックされています"
        }
      ]
    }
  }
}
```

### 自動フォーマット

```json
{
  "hooks": {
    "postToolUse": {
      "Edit": [
        {
          "pattern": "\\.(ts|tsx|js|jsx)$",
          "command": "npx prettier --write $FILE_PATH"
        }
      ]
    }
  }
}
```

### 通知音

`.claude/hooks/response-complete.sh`:

```bash
#!/bin/bash
afplay /System/Library/Sounds/Glass.aiff 2>/dev/null &
```

## 利用可能な変数

- `$FILE_PATH` - 編集されたファイルのパス
- `$TOOL_NAME` - 使用されたツール名
- `$PROJECT_DIR` - プロジェクトのルートディレクトリ

## 設定場所

1. **シェルスクリプト**: `.claude/hooks/<event-name>.sh`
2. **JSON設定**: `.claude/settings.json`

## 許可設定

```json
{
  "permissions": {
    "allow": ["Edit", "Write", "Bash(npm test:*)"]
  }
}
```
