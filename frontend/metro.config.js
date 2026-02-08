const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 詳細なログを出力する設定
config.resetCache = true;
config.maxWorkers = 2;
config.watchFolders = [];

// ソースマップを有効にしてエラー箇所を特定しやすくする
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true,
  },
};

module.exports = config;
