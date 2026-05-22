const { withDangerousMod, createRunOncePlugin } = require('@expo/config-plugins');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SPLASH_IMAGE = 'assets/splash.png';
const SPLASH_ASPECT = 2778 / 1284;

const DENSITY_WIDTHS = {
  'drawable-mdpi': 320,
  'drawable-hdpi': 480,
  'drawable-xhdpi': 720,
  'drawable-xxhdpi': 1080,
  'drawable-xxxhdpi': 1440,
};

const LAUNCHER_BACKGROUND_XML = `<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item>
    <bitmap android:gravity="fill" android:src="@drawable/splashscreen_logo"/>
  </item>
</layer-list>
`;

const LEGACY_SPLASH_STYLE = `  <style name="Theme.App.SplashScreen" parent="AppTheme">
    <item name="android:windowBackground">@drawable/ic_launcher_background</item>
  </style>
`;

function generateSplashDrawables(projectRoot) {
  const splashSrc = path.join(projectRoot, SPLASH_IMAGE);
  if (!fs.existsSync(splashSrc)) {
    throw new Error(`Splash image not found at ${SPLASH_IMAGE}`);
  }

  const resDir = path.join(projectRoot, 'android/app/src/main/res');

  Object.entries(DENSITY_WIDTHS).forEach(([folder, width]) => {
    const height = Math.round(width * SPLASH_ASPECT);
    const outDir = path.join(resDir, folder);
    const outFile = path.join(outDir, 'splashscreen_logo.png');

    fs.mkdirSync(outDir, { recursive: true });
    execSync(
      `magick "${splashSrc}" -resize ${width}x${height}^ -gravity center -extent ${width}x${height} "${outFile}"`,
      { stdio: 'pipe' },
    );
  });
}

function patchStylesXml(stylesPath) {
  let contents = fs.readFileSync(stylesPath, 'utf8');
  const splashStylePattern =
    /  <style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>\n/;

  if (!splashStylePattern.test(contents)) {
    throw new Error('Theme.App.SplashScreen style not found in styles.xml');
  }

  contents = contents.replace(splashStylePattern, `${LEGACY_SPLASH_STYLE}\n`);
  fs.writeFileSync(stylesPath, contents, 'utf8');
}

function withAndroidFullscreenSplash(config) {
  return withDangerousMod(config, [
    'android',
    cfg => {
      const projectRoot = cfg.modRequest.projectRoot;
      const resDir = path.join(projectRoot, 'android/app/src/main/res');

      generateSplashDrawables(projectRoot);

      fs.writeFileSync(path.join(resDir, 'drawable/ic_launcher_background.xml'), LAUNCHER_BACKGROUND_XML, 'utf8');
      patchStylesXml(path.join(resDir, 'values/styles.xml'));

      return cfg;
    },
  ]);
}

module.exports = createRunOncePlugin(
  withAndroidFullscreenSplash,
  'with-android-fullscreen-splash',
  '1.0.0',
);
