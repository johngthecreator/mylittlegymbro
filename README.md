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
2. Bundle JS code and produce main.jsbundle for prod distribution

   ```bash
   npx expo export:embed --entry-file='node_modules/expo-router/entry.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios'
   pnpm exec expo export:embed --entry-file='node_modules/expo-router/entry.js' --bundle-output='./ios/main.jsbundle' --dev=false --platform='ios'
   ```
3. Open /ios in Finder and open project in Xcode by double-clicking the file with the .xcworkspace extension

4. Right click on the main file directory above /Pods and click add files to "<app-name>" (make sure to only reference and not move or copy the files over)

5. Double check that you've chosen a group for signing certificates and check the automatically sign checkbox.

6. Click the run button to build the app.


