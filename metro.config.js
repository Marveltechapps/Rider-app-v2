const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// libphonenumber-js ships ESM .js subpath exports; allow .cjs fallback for Metro.
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = config;
