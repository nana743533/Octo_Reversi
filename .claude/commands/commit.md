---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*), Bash(git diff:*), Bash(git log:*)
description: Gitコミットを作成
argument-hint: "[コミットメッセージのオプション]"
---

# Gitコミット

変更に基づいてGitコミットを作成します。

## 手順

1. **現在の状態を確認**
   - Gitステータス: `git status`
   - 変更内容: `git diff HEAD`
   - 現在のブランチ: `git branch --show-current`
   - 最近のコミット: `git log --oneline -10`

2. **コミットメッセージを作成**
   - 変更内容を分析
   - Semantic Commit 形式でメッセージを作成:
     - `feat:` 新機能
     - `fix:` バグ修正
     - `docs:` ドキュメント
     - `style:` フォーマット
     - `refactor:` リファクタリング
     - `test:` テスト
     - `chore:` その他

3. **コミットを作成**
   - 適切なファイルをステージング
   - コミットメッセージでコミットを作成
   - `Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>` を含める

## 使用例

```
/commit
```

```
/commit "feat: 新しい機能を追加"
```
