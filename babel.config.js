module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],

    plugins: [
      ['@realm/babel-plugin', { syncPolicy: 'never' }],
      'react-native-reanimated/plugin', // This plugin must be last!
    ],
  };
};