const { withInfoPlist, createRunOncePlugin } = require('@expo/config-plugins');

/**
 * react-native-screens (RNSScreenView statusBarStyle) requires
 * UIViewControllerBasedStatusBarAppearance = YES in Info.plist.
 * Expo's default template sets this to NO; this plugin forces YES on prebuild.
 */
module.exports = createRunOncePlugin(
  (config) =>
    withInfoPlist(config, (config) => {
      config.modResults.UIViewControllerBasedStatusBarAppearance = true;
      return config;
    }),
  'with-ios-uiviewcontroller-based-status-bar'
);
