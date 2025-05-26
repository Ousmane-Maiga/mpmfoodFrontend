const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Fix asset registry path
config.resolver.assetRegistryPath = "expo-asset/tools/AssetRegistry";

module.exports = config;
