const { withDangerousMod, createRunOncePlugin } = require('@expo/config-plugins');
const { patchAndroidFullscreenSplash } = require('./scripts/patch-android-fullscreen-splash');

/**
 * Runs after expo-splash-screen during prebuild (listed after it in app.config.ts).
 * Re-applies fullscreen splash because expo-splash-screen resets Android 12 icon-based styles.
 */
function withAndroidFullscreenSplash(config) {
  return withDangerousMod(config, [
    'android',
    async cfg => {
      await patchAndroidFullscreenSplash(cfg.modRequest.projectRoot);
      return cfg;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withAndroidFullscreenSplash,
  'with-android-fullscreen-splash',
  '1.0.0',
);
