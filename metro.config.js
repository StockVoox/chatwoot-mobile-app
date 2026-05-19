const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const withStorybook = require('@storybook/react-native/metro/withStorybook');

const { SENTRY_ENABLED } = require('./sentry.config.js');

/** @type {import('expo/metro-config').MetroConfig} */
const defaultConfig = getDefaultConfig(__dirname);
const sentryConfig = SENTRY_ENABLED
  ? require('@sentry/react-native/metro').getSentryExpoConfig(__dirname)
  : {};

const config = {
  ...defaultConfig,
  ...sentryConfig,
};

module.exports = withStorybook(config, {
  enabled: true,
  configPath: path.resolve(__dirname, './.storybook'),
});
