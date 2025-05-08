// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  "@callstack/react-theme-provider": require.resolve(
    "react-native-paper/src/core/theming.tsx"
  ),
};

module.exports = config;
