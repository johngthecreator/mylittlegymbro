# Welcome to mylittlegymbro 👋

## Get started

1. Install dependencies

   ```bash
   npm install
   pnpm install
   ```

2. Start the app

   ```bash
   npx expo start
   pnpm exec expo start
   ```

## Setting up an IOS dev build
1. Create IOS and Android native projects

   ```bash
   npx expo prebuild
   pnpm exec expo prebuild
   ```
2. Make sure EXPO_EXECUTION_ENV=prod in your .env file (set this to "expo" if you want to develop locally with expo go)

3. Bundle JS code and produce main.jsbundle for prod distribution

   ```bash
   npx expo export:embed --entry-file='node_modules/expo-router/entry.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios'
   pnpm exec expo export:embed --entry-file='node_modules/expo-router/entry.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios'
   ```
4. Open /ios in Finder and open project in Xcode by double-clicking the file with the .xcworkspace extension

5. Right click on the main file directory above /Pods and click add files to "<app-name>" (make sure to only reference and not move or copy the files over)

6. Double check that you've chosen a group for signing certificates and check the automatically sign checkbox.

7. Make sure your phone is in dev mode and that you trust the certificate you're signing the app with. This can be found in Settings > General > VPN & Device Management.

8. Click the run button to build the app.


