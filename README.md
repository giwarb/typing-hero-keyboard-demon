# タイピング勇者とキーボードの魔王

小学生向けの 1 分間タイピング RPG です。Vite + TypeScript + Phaser で、GitHub Pages にそのままデプロイできます。

## 開発

```bash
npm install
npm run dev
```

## テストとビルド

```bash
npm test
npm run build
```

## GitHub Pages

`main` ブランチへ push すると `.github/workflows/pages.yml` が `npm test` と `npm run build` を実行し、`dist` を GitHub Pages に公開します。リポジトリ設定で Pages の source を GitHub Actions にしてください。
