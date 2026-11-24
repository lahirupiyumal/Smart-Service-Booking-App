# Smart Service Booking

A Sri Lankan service marketplace built with Expo, React Native and Firebase. The repository contains the mobile application and a Firebase Functions backend scaffold.

## Install and run the mobile app

Use Node **22.13+ (22.x)** and npm. From the repository root:

```sh
npm --prefix mobile-app install
npm start
```

`npm run mobile` also starts Expo. Scan the QR code with a compatible Expo Go build, or press `w` for web, `a` for an Android emulator, or `i` for an iOS simulator. Platform tooling must be installed separately.

The app opens directly on Home. Login, sign-up and password-reset pages have been removed; category browsing does not require an account. Home, Agricultural and Vehicle Services have subcategory cards and local search.

## Firebase configuration

For Firebase services, copy the template if you do not already have a local environment file:

```sh
cp -n mobile-app/.env.example mobile-app/.env
```

Fill in the `EXPO_PUBLIC_FIREBASE_*` values in `mobile-app/.env` using your Firebase web app configuration. Enable Email/Password Authentication and configure Firestore and Storage. Restart Expo after editing environment variables.

The app retains existing-session handling for protected routes. User profile provisioning is separate: provision `users/{uid}` through trusted tooling with `uid`, `email`, `displayName` and `role` (`customer`, `provider` or `admin`). Client profile writes and self-assignment of roles are denied.

Firebase client configuration is public. Keep server secrets out of `EXPO_PUBLIC_*` variables. No Firebase resources are deployed by these setup steps.

## Backend tools

The backend has its own dependencies; they are not required to start the mobile UI:

```sh
npm --prefix functions ci
npm run build:functions
npm --prefix functions run serve -- --project YOUR_PROJECT_ID
```

Firebase emulators require Java and a selected project. The mobile client currently connects to its configured Firebase services; emulator routing is not configured. Functions has no exported handlers yet.

## Validation

```sh
cd mobile-app
npm run typecheck
npx expo export --platform web
```

From the repository root, after installing backend dependencies, check both projects with `npm run typecheck` and build the backend with `npm run build:functions`.

Booking workflows, payments, reviews, favorites, notification delivery, maps and provider management remain unfinished. Native device behavior and real Firebase account flows require testing with configured services.

## Project guide

- [Mobile app editing guide](mobile-app/README.md) — find screens, styles, categories and images.
- [Complete source structure](docs/folder-structure.md)
- [Architecture](docs/architecture.md)
- [Proposed database schema](docs/database-schema.md)
