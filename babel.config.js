module.exports = function(api) {
  api.cache(true);

  const isExpoGo = process.env.EXPO_EXECUTION_ENV === 'expo';

  console.log(isExpoGo)

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Other plugins here
      !isExpoGo && 'react-native-worklets/plugin', // Only use worklets plugin if not in Expo Go
    ].filter(Boolean),  // Filter out falsy values
  };
};

