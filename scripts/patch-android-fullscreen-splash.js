/**
 * Applies fullscreen Android splash after expo prebuild.
 * Uses @expo/image-utils (sharp/jimp) so EAS Build works without ImageMagick.
 */
const { generateImageAsync } = require('@expo/image-utils');
const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
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

async function generateSplashDrawables(projectRoot, resDir) {
  const splashSrc = path.join(projectRoot, SPLASH_IMAGE);
  if (!fs.existsSync(splashSrc)) {
    throw new Error(`Splash image not found: ${splashSrc}`);
  }

  await Promise.all(
    Object.entries(DENSITY_WIDTHS).map(async ([folder, width]) => {
      const height = Math.round(width * SPLASH_ASPECT);
      const outDir = path.join(resDir, folder);
      const outFile = path.join(outDir, 'splashscreen_logo.png');

      fs.mkdirSync(outDir, { recursive: true });

      const { source } = await generateImageAsync(
        { projectRoot, cacheType: 'splash-android-fullscreen' },
        {
          src: splashSrc,
          resizeMode: 'cover',
          width,
          height,
          backgroundColor: '#ffffff',
        },
      );

      await fs.promises.writeFile(outFile, source);
    }),
  );
}

function patchStylesXml(stylesPath) {
  let contents = fs.readFileSync(stylesPath, 'utf8');
  const splashStylePattern = /  <style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>\s*/;

  if (!splashStylePattern.test(contents)) {
    throw new Error(`Theme.App.SplashScreen not found in ${stylesPath}`);
  }

  contents = contents.replace(splashStylePattern, `${LEGACY_SPLASH_STYLE}\n`);
  fs.writeFileSync(stylesPath, contents, 'utf8');
}

async function patchAndroidFullscreenSplash(projectRoot = PROJECT_ROOT) {
  const resDir = path.join(projectRoot, 'android/app/src/main/res');
  const stylesPath = path.join(resDir, 'values/styles.xml');

  if (!fs.existsSync(stylesPath)) {
    throw new Error(
      'android/app/src/main/res/values/styles.xml not found. Run expo prebuild first.',
    );
  }

  await generateSplashDrawables(projectRoot, resDir);

  fs.mkdirSync(path.join(resDir, 'drawable'), { recursive: true });
  fs.writeFileSync(
    path.join(resDir, 'drawable/ic_launcher_background.xml'),
    LAUNCHER_BACKGROUND_XML,
    'utf8',
  );
  patchStylesXml(stylesPath);

  console.log('[patch-android-fullscreen-splash] Fullscreen splash applied.');
}

if (require.main === module) {
  patchAndroidFullscreenSplash().catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { patchAndroidFullscreenSplash };
