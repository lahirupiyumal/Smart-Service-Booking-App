# Architecture

Smart Service Booking is a Sri Lankan service marketplace. This repository contains three independently installed npm projects, keeping mobile native dependencies separate from browser and server dependencies. Node 22.13+ is required; Functions targets Node 22.

## Mobile

Expo, React Native, TypeScript strict mode, and Expo Router provide file-based navigation. Route files compose reusable UI from `src/components`; feature modules will own business behavior. Service adapters isolate Firebase and future payment, maps, and notification integrations. `src/theme` supplies shared colors and spacing.

The root layout mounts AuthProvider. Firebase is initialized once only when all public configuration values exist. Native Auth uses AsyncStorage persistence; web uses browser persistence. AuthProvider observes authentication and the user's own Firestore profile, reports loading/errors, and cleans up subscriptions.

Customer and provider routes are explicitly labeled previews and contain no privileged data. They are intentionally accessible without signing in for scaffold review. Before live features, add protected route groups, role-aware redirects, provider approval checks, and server authorization. Client routing is never the security boundary. Admin accounts are managed by trusted server tooling; no client can assign a role.

## Administration

React + Vite + TypeScript provides a responsive sidebar, header, and section placeholders. No administrative data or write actions are exposed. Firebase client initialization is prepared separately. Authentication and server-verified admin claims must be implemented before connecting management pages.

## Backend and security

Firebase Authentication identifies users; Firestore stores profiles and marketplace documents; Storage will hold approved uploads. Initial rules allow an authenticated user to get only their own profile. Other Firestore operations and all Storage operations are denied. Profiles must currently be provisioned through trusted tooling. Admin SDK bypasses rules, so every future callable function must enforce identity, roles, input validation, and ownership.

Functions initializes Admin SDK and sets `asia-south1` and an instance limit. Feature modules contain no deployed handlers yet. Confirm region before provisioning Firestore/Storage. Do not deploy infrastructure as part of scaffold review.

## Deferred integrations

Bookings, registration, password recovery, live search, reviews, favorites, push permission/token registration, maps, and PayHere are not implemented. Expo Notifications is installed but no permission is requested automatically. Payments must eventually use server-side verification and idempotent webhook handling; no processing exists now.

EXPO_PUBLIC and VITE variables are bundled public configuration, not secret storage. Never put service account keys, PayHere secrets, or privileged credentials there. Future function secrets belong in Firebase Secret Manager.
