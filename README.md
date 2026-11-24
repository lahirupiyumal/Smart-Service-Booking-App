# Smart Service Booking

A Sri Lankan service marketplace foundation built with Expo, React Native, Firebase, and a separate React administration dashboard.

This phase includes configuration, reusable UI, customer/provider previews, email sign-in plumbing, Firebase session/profile context, and server project setup. Registration, booking workflows, payments, administrative actions, notifications delivery, and maps remain unimplemented.

## Verification status

Source scaffold is written. Dependency installation was attempted but failed with `ENOSPC` (disk full), with additional npm registry timeouts. Partial project installs were removed. Expo startup, dependency-aware TypeScript checks, and production builds have **not passed or been verified**. Free at least 2–3 GB before reinstalling and running the checks below. No Firebase resources were deployed.

## Requirements and installation

Use Node 22.13+ and npm. Install each project independently; each uses its own dependency manifest. The Functions lockfile is included; mobile/admin lockfile generation was interrupted by registry timeouts.

```sh
npm --prefix mobile-app install
npm --prefix admin-dashboard install
npm --prefix functions ci
```

## Run mobile

```sh
npm run mobile
# Or:
cd mobile-app
npm run android
npm run ios
npm run web
```

Scan the Expo QR code with a compatible Expo Go build, or use an installed Android emulator/iOS Simulator. Native simulator tooling must be installed separately. The welcome screen opens without Firebase credentials. Preview navigation is public and does not imply role authorization.

## Firebase configuration

```sh
cp mobile-app/.env.example mobile-app/.env
cp admin-dashboard/.env.example admin-dashboard/.env
```

Create/select your Firebase project and register a web app. Copy its public configuration to both environment files using their respective prefixes. Enable Email/Password Authentication, create Firestore and Storage, and confirm the backend region. Restart Expo/Vite after editing environment variables.

For initial sign-in testing, create an Auth user in Firebase Console and provision `users/{uid}` through trusted tooling with `uid`, `email`, `displayName`, and `role` (`customer`, `provider`, or `admin`). Client profile writes and self-assignment of roles are denied. Profile provisioning and registration flows will be built later.

Public Firebase config is bundled in clients. Never use these variables for server secrets. No Firebase project ID or credentials are committed. Add your project alias with Firebase CLI before any deployment. This task does not deploy anything.

## Run administration and backend tools

```sh
npm run admin
npm run build:admin
npm run build:functions
npm --prefix functions run serve -- --project YOUR_PROJECT_ID
```

The admin dashboard contains preview sections only. Firebase emulators require Java and a selected project; mobile and admin clients currently use configured Firebase services, not emulators. Emulator client routing is a future configuration step. Functions has no exported handlers yet.

## Validation

```sh
npm run typecheck
npm run build:admin
npm run build:functions
cd mobile-app
npx expo install --check
npx expo export --platform web
```

## Dependencies

Mobile: Expo/React Native/React, Expo Router, safe-area context, native screens, linking/constants/status bar, React Native Web/React DOM, Firebase JS SDK, AsyncStorage for native auth persistence, and Expo Notifications for future push integration. These dependencies are declared; the complete installation remains pending. TypeScript and React types are development tools. Expo selects compatible native package versions.

Administration: React/React DOM, Firebase JS SDK, Vite, the React Vite plugin, TypeScript, and React type packages. No UI framework or charting library is added.

Backend: firebase-admin, firebase-functions, TypeScript, and firebase-tools for local emulators and CLI operations. There is no payment SDK.

## Documentation

- [Architecture](docs/architecture.md)
- [Proposed database schema](docs/database-schema.md)
- [Complete source structure](docs/folder-structure.md)

Firebase project configuration, initial users/profiles, platform tooling, and future production identifiers still require your input. Maps and PayHere credentials are not needed for this phase.

Compatibility references: [Expo Router installation](https://docs.expo.dev/router/installation/) and [Firebase JS SDK in Expo](https://docs.expo.dev/guides/using-firebase/). Mobile package versions follow the installed Expo 58.0.26 compatibility manifest inspected during setup.
