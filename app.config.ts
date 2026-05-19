import { ConfigContext, ExpoConfig } from 'expo/config';
import fs from 'fs';
import path from 'path';

function resolveGoogleServicesFile(filePath: string | undefined): string | undefined {
  if (!filePath?.trim()) {
    return undefined;
  }

  const resolvedPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
  return fs.existsSync(resolvedPath) ? filePath : undefined;
}

export default ({ config }: ConfigContext): ExpoConfig => {
  const iosGoogleServicesFile = resolveGoogleServicesFile(
    process.env.EXPO_PUBLIC_IOS_GOOGLE_SERVICES_FILE,
  );
  const androidGoogleServicesFile = resolveGoogleServicesFile(
    process.env.EXPO_PUBLIC_ANDROID_GOOGLE_SERVICES_FILE,
  );

  return {
    name: 'Targetly AI',
    slug: process.env.EXPO_PUBLIC_APP_SLUG || 'targetai-mobile',
    version: '4.5.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: false,
    scheme: 'targetlyaiapp',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
      enableFullScreenImage_legacy: true,
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.targetlyai.app',
      infoPlist: {
        NSCameraUsageDescription:
          'This app requires access to the camera to upload images and videos.',
        NSPhotoLibraryUsageDescription:
          'This app requires access to the photo library to upload images.',
        NSMicrophoneUsageDescription: 'This app requires access to the microphone to record audio.',
        NSAppleMusicUsageDescription:
          'This app does not use Apple Music, but a system API may require this permission.',
        UIBackgroundModes: ['fetch', 'remote-notification'],
        ITSAppUsesNonExemptEncryption: false,
      },
      ...(iosGoogleServicesFile ? { googleServicesFile: iosGoogleServicesFile } : {}),
      entitlements: { 'aps-environment': 'production' },
      associatedDomains: ['applinks:app.targetly-ai.com'],
    },
    android: {
      adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#ffffff' },
      package: 'com.targetlyai.app',
      permissions: ['android.permission.CAMERA', 'android.permission.RECORD_AUDIO'],
      ...(androidGoogleServicesFile ? { googleServicesFile: androidGoogleServicesFile } : {}),
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: 'https',
              host: 'app.targetly-ai.com',
              pathPrefix: '/app/accounts/',
              pathPattern: '/*/conversations/*',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
        {
          action: 'VIEW',
          data: [
            {
              scheme: 'targetlyaiapp',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },
    extra: {
      eas: {
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
        storybookEnabled: process.env.EXPO_STORYBOOK_ENABLED,
      },
    },
    owner: 'chatwoot',
    plugins: [
      'expo-font',
      ['react-native-permissions', { iosPermissions: ['Camera', 'PhotoLibrary', 'MediaLibrary'] }],
      [
        '@sentry/react-native/expo',
        {
          url: 'https://sentry.io/',
          project: process.env.EXPO_PUBLIC_SENTRY_PROJECT_NAME,
          organization: process.env.EXPO_PUBLIC_SENTRY_ORG_NAME,
        },
      ],
      ...(iosGoogleServicesFile
        ? (['@react-native-firebase/app', '@react-native-firebase/messaging'] as const)
        : []),
      [
        'expo-build-properties',
        {
          // https://github.com/invertase/notifee/issues/808#issuecomment-2175934609
          android: {
            minSdkVersion: 24,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            enableProguardInReleaseBuilds: true,
          },
          ios: { useFrameworks: 'static' },
        },
      ],
      './with-ffmpeg-pod.js',
    ],
    androidNavigationBar: { backgroundColor: '#ffffff' },
  };
};
