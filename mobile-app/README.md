# SmartServe mobile app

Expo Router + React Native application. Start here when looking for a screen or feature.

## Where to edit

| What you want to change | File / folder |
| --- | --- |
| Home page, category cards, search, mobile grid | `src/features/customer/screens/HomeScreen.tsx` |
| Home page colors, spacing, card styles | `src/features/customer/styles/HomeScreen.styles.ts` |
| Register, login and password reset screens | `src/features/auth/screens/` |
| Shared auth fields, responsive layout and styles | `src/features/auth/components/`, `src/features/auth/styles/` |
| Registration, login, password reset and sign out | `src/features/auth/services/authService.ts` |
| Auth validation and error messages | `src/features/auth/utils/` |
| Current user and session restoration | `src/features/auth/context/AuthContext.tsx` |
| Categories, subcategories and service names | `src/features/services/data/categories.ts` |
| Agricultural Vee / Tea choices | `src/features/services/data/agriculturalCrops.ts` |
| Category image references | `src/features/services/data/serviceImages.ts` |
| Category TypeScript interfaces | `src/features/services/types/category.ts` |
| Main category images | `assets/images/services/main-categories/` |
| Subcategory images | `assets/images/services/home/`, `agricultural/`, `vehicle/` |
| AI image generation prompts | `assets/image-generation/` |
| Customer profile | `src/features/customer/screens/ProfileScreen.tsx` |
| Profile layout and colors | `src/features/customer/styles/ProfileScreen.styles.ts` |
| Local profile storage | `src/features/customer/services/profileStorage.ts` |
| Profile fields and avatar colors | `src/features/customer/types/profile.ts` |
| Bottom navigation | `src/navigation/CustomerTabs.tsx` |
| Login guards and root navigation | `src/navigation/RootNavigator.tsx` |
| Startup redirect | `src/navigation/EntryRedirect.tsx` |
| Provider screens | `src/features/provider/screens/` |
| Booking screens | `src/features/bookings/screens/` |
| Shared buttons, icons and layout | `src/components/` |
| Shared theme | `src/theme/index.ts` |
| Firebase initialization | `src/config/firebase.ts` |
| Environment variable mapping | `src/config/env.ts` |

## Folder responsibilities

```text
mobile-app/
├── app/                       # Expo Router routes: small entry files
├── assets/
│   ├── image-generation/      # Prompt manifests for generated images
│   └── images/services/
│       ├── main-categories/
│       ├── home/
│       ├── agricultural/
│       └── vehicle/
├── src/
│   ├── features/              # App behavior grouped by feature
│   │   ├── auth/              # Auth screens, services, session, validation and types
│   │   ├── bookings/screens/
│   │   ├── customer/          # Home, profile, home styles
│   │   ├── favorites/screens/
│   │   ├── notifications/screens/
│   │   ├── provider/screens/
│   │   └── services/          # Category data, image registry, types, explore
│   ├── navigation/            # Root stack and customer/provider tabs
│   ├── components/            # Reusable UI used across features
│   ├── config/                # Firebase and environment configuration
│   └── theme/                 # Shared visual tokens
├── .env.example
├── app.json
├── package.json
└── tsconfig.json
```

`app/` defines URLs and route groups. Keep screen implementations in `src/features/` and navigation implementations in `src/navigation/`. The `(customer)` and `(provider)` names are Expo Router route groups; keep these names when editing screen content.

Some screens are still placeholders: bookings, payments and provider workflows are not complete.

## Development

Use Node 22.13+ (22.x), then run from this folder:

```sh
npm install
npm start
npm run typecheck
npm run test:auth
npx expo export --platform web
```

The app opens on Login for signed-out users and returns there after sign-out. Login links to Register and Forgot Password. An active Firebase session with a complete Firestore profile opens Home (or the provider dashboard for an existing provider). Customer, booking, provider and notification routes require an active account profile. New registrations always have the customer role.

## Firebase authentication setup

1. Keep all six `EXPO_PUBLIC_FIREBASE_*` values in the root `.env` (see `.env.example`). Restart Expo after editing them: `npx expo start --clear`. Client configuration is public; never put service-account credentials here.
2. In the Firebase project `smartservice-e7d22`, enable **Authentication → Sign-in method → Email/Password** and create the Cloud Firestore database if needed.
3. The repository's `../firebase.json` references `../firebase/firestore.rules`. That referenced file currently denies client profile creation. The `firestore.rules` file in this mobile-app folder is a proposed, scoped registration rule change pending approval; it is not used by the deployment config. It permits only an authenticated owner's initial customer profile with validated fields and fixed role/status, while preserving the existing update/delete and other-collection denials. Review and approve this security-boundary change before applying or publishing it. Until profile creation is permitted by the deployed rules (or implemented by a trusted backend), registration cannot complete and the client rolls back the new Auth account.
4. On web, add the development/hosting domain to Firebase Authentication's authorized domains as needed for your deployment.

Registration creates an email/password Firebase Auth account, sets its display name, and writes exactly `uid`, `fullName`, `email`, `phone`, `role`, `isActive`, and a server `createdAt` timestamp to `users/{uid}`. Passwords and confirmation fields are never written to Firestore. A failed profile write attempts to delete the newly created Auth account; a failed rollback signs out and reports the incomplete account for support. The router waits for a committed profile before opening protected screens.

Existing user documents must match this schema and have `isActive: true`. Missing, invalid, unreadable or inactive profiles show a recovery message with retry/sign-out actions. Sign-in does not silently create or activate an existing user's profile. Password-reset confirmation uses the same message for unknown email addresses.

`npm run test:auth` uses mocked Firebase SDK calls to check validation, profile fields, UID routing, rollback and error handling. It does not create live accounts or send reset emails. For a live smoke test, register a test customer, verify the document at `users/{uid}`, restart the app to check persistence, sign out/in, request a reset email, and verify that signed-out deep links cannot access Home or booking routes. Firebase console settings, deployed rules, native UI and delivery of reset emails require a configured Firebase project and a device/browser test.

An actual Identity Toolkit diagnostic returned HTTP 400 with reason `API_KEY_INVALID` and SDK code `auth/api-key-not-valid.-please-pass-a-valid-api-key.`. The rejected `.env` API key was corrected using the verified key already present in this project's `google-services.json`; no other Firebase project values were changed. Restart Expo with `npx expo start --clear` after this change. The subsequent live registration reached Auth account creation and then failed on the Firestore write with `permission-denied`, matching the referenced rules' explicit create denial. The Auth rollback completed. API-key failures and Firestore permission failures now have distinct actionable messages; unmapped Firebase failures display a safe diagnostic code instead of hiding it behind a generic message.

## Temporary service category initialization

Start Expo with `npm start`, sign in, open the customer **Home** tab, and scroll to **Temporary category setup**. The development-only section shows the active session UID and profile role. Press **Initialize Service Categories** once. It is disabled when signed out or while authentication/initialization is pending. Initialization runs only on a button press, never on import or render.

`src/scripts/seedCategories.ts` creates missing `service_categories/home_services`, `service_categories/agriculture_services`, and `service_categories/vehicle_services` documents in a Firestore transaction. Existing category documents are preserved; no user documents or other collections are written. The success alert appears only after the transaction completes and all three documents are confirmed with server reads. An offline or denied verification cannot report success. The actual Firebase error code and message appear both in an alert (web/native) and inline on failure.

The checked-in deployment rules at `../firebase/firestore.rules` deny all category reads and writes, including for signed-in users; the separate mobile-app rules file also denies category access. These local files do not establish which rules are currently deployed. Initialization needs an authorized session and deployed rules that permit its category reads and missing-document creates. This implementation does not change security rules or elevate account roles. It has not verified category creation in live Firestore. `npm run test:categories` checks the operation using mocked SDK calls, including permission failures, preservation of existing data, and waiting for all server confirmations.

## Adding a feature or image

1. Put feature screens in `src/features/<feature>/screens/`.
2. Add a small route in `app/` that exports the screen. Register navigation where necessary.
3. Keep feature-specific data, components, styles and types beside that feature. Share UI through `src/components/` only when multiple features use it.
4. Save category images in the matching `assets/images/services/` folder, add a static `require` to `serviceImages.ts`, then reference it from `categories.ts`.
5. Run the TypeScript check and a relevant platform build after changing imports or routes.

For the complete repository tree, see [folder structure](../docs/folder-structure.md).

The customer Profile screen initially uses the registered Firestore name, email and phone when no local value exists. Its existing profile editor still saves later edits on the current device through AsyncStorage; those edits do not update Firebase Authentication or Firestore and are not synchronized to other devices.
