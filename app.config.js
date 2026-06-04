/**
 * Expo app config – loads rider_app/.env and injects apiBaseUrl into expo.extra
 * so EXPO_PUBLIC_API_BASE_URL is always available at runtime (not only via Metro cache).
 */
const path = require('path');
const fs = require('fs');
const appJson = require('./app.json');
const { withGoogleMapsApiKey } = require('@expo/config-plugins/build/android/GoogleMapsApiKey.js');
const withIosUIViewControllerBasedStatusBar = require('./plugins/withIosUIViewControllerBasedStatusBar.js');

const envPath = path.resolve(__dirname, '.env');
const DEFAULT_BACKEND_PORT = 3333;
const DEFAULT_DEV_API_BASE_URL = `http://localhost:${DEFAULT_BACKEND_PORT}`;

try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
  } else {
    try {
      require('dotenv').config({ path: envPath });
    } catch {
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        envContent.split(/\r?\n/).forEach((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) return;
          const separatorIndex = trimmed.indexOf('=');
          if (separatorIndex === -1) return;
          const key = trimmed.slice(0, separatorIndex).trim();
          const value = trimmed.slice(separatorIndex + 1).trim();
          if (key && process.env[key] === undefined) {
            process.env[key] = value;
          }
        });
      }
    }
  }
} catch {
  // ignore
}

const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const apiBaseUrl =
  (process.env.EXPO_PUBLIC_API_BASE_URL || '').trim() || DEFAULT_DEV_API_BASE_URL;
const apiTunnelBaseUrl = (process.env.EXPO_PUBLIC_API_TUNNEL_BASE_URL || '').trim();

if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
  process.env.EXPO_PUBLIC_API_BASE_URL = apiBaseUrl;
}

module.exports = {
  expo: {
    ...appJson.expo,
    plugins: [
      ...(appJson.expo.plugins || []),
      [
        'expo-location',
        {
          locationWhenInUsePermissionMessage:
            'QuickRider uses your location to detect your city and show you on the map during onboarding.',
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission: 'Allow camera access to scan delivery bag barcodes at the darkstore.',
        },
      ],
      withGoogleMapsApiKey,
      withIosUIViewControllerBasedStatusBar,
    ],
    ios: {
      ...appJson.expo.ios,
      config: {
        ...(appJson.expo.ios?.config || {}),
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
      infoPlist: {
        ...(appJson.expo.ios?.infoPlist || {}),
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
          NSAllowsLocalNetworking: true,
        },
      },
    },
    android: {
      ...appJson.expo.android,
      config: {
        ...(appJson.expo.android?.config || {}),
        googleMaps: {
          apiKey: googleMapsApiKey,
        },
      },
    },
    extra: {
      ...(appJson.expo.extra || {}),
      apiBaseUrl,
      ...(apiTunnelBaseUrl ? { apiTunnelBaseUrl } : {}),
    },
  },
};
