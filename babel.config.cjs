// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // IMPORTANT: This plugin MUST be last!
      "react-native-reanimated/plugin",
    ],
  };
};
