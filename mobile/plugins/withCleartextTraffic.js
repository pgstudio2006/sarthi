const { withAndroidManifest } = require('expo/config-plugins');

module.exports = function withCleartextTraffic(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application;
    if (application && application[0]) {
      application[0].$['android:usesCleartextTraffic'] = 'true';
    }
    return config;
  });
};
