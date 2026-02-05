---
allowed-tools: Bash, Glob, Grep, Read, Task
description: コードレビューを実行
argument-hint: "[ファイルパスまたはディレクトリ]"
---

# コードレビュー

指定されたコードの包括的なレビューを実行します。

## レビュー項目

1. **バグとエラー**
   - 論理エラー
   - エッジケースの見落とし
   - リソースリーク

2. **コード品質**
   - 可読性
   - 保守性
   - DRY原則の遵守

3. **プロジェクト規約**
   - CLAUDE.mdの遵守
   - コードスタイル
   - アーキテクチャ

4. **セキュリティ**
   - 一般的な脆弱性
   - 入力検証
   - 機密情報の扱い

## 使用例

```
/code-review src/components/Button.tsx
```

```
/code-review
```
