# Architecture

Smart Service Booking is a Sri Lankan service marketplace. This repository contains two independently installed npm projects: the Expo mobile app and Firebase Functions backend. Node 22.13+ is required; Functions targets Node 22.

## Mobile

Expo, React Native, TypeScript strict mode, and Expo Router provide file-based navigation. Route files in `app/` export screens from `src/features/`. Feature folders group screens, styles, data, services and types; `src/components` contains shared UI and `src/navigation` contains stacks and tabs. Service adapters isolate Firebase and future payment, maps, and notification integrations. `src/theme` supplies shared colors and spacing.

The root layout mounts AuthProvider. Firebase is initialized once only when all public configuration values exist. Native Auth uses AsyncStorage persistence; web uses browser persistence. AuthProvider observes authentication and the user's own Firestore profile, reports loading/errors, and cleans up subscriptions.

Customer browsing supports guest access. Provider routes, bookings and notifications require an authenticated session through the root navigator. Provider approval checks, role-aware routing and server authorization are still required before connecting privileged features. Client routing is never the security boundary. Admin accounts are managed by trusted server tooling; no client can assign a role.

## Backend and security

Firebase Authentication identifies users; Firestore stores profiles and marketplace documents; Storage will hold approved uploads. Initial rules allow an authenticated user to get only their own profile. Other Firestore operations and all Storage operations are denied. Profiles must currently be provisioned through trusted tooling. Admin SDK bypasses rules, so every future callable function must enforce identity, roles, input validation, and ownership.

Functions initializes Admin SDK and sets `asia-south1` and an instance limit. No feature handlers are exported yet. Confirm region before provisioning Firestore/Storage. Do not deploy infrastructure as part of scaffold review.

## Deferred integrations

Booking workflows, registration profile provisioning, reviews, favorites, push permission/token registration, maps, and PayHere are not implemented. Email/password sign-in, Auth account creation, password reset and local category search are implemented. Expo Notifications is installed but no permission is requested automatically. Payments must eventually use server-side verification and idempotent webhook handling; no processing exists now.

EXPO_PUBLIC variables are bundled public configuration, not secret storage. Never put service account keys, PayHere secrets, or privileged credentials there. Future function secrets belong in Firebase Secret Manager.
