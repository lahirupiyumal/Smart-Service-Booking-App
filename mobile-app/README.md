# SmartServe mobile app

Expo Router + React Native application. Start here when looking for a screen or feature.

## Where to edit

| What you want to change | File / folder |
| --- | --- |
| Home page, category cards, search, mobile grid | `src/features/customer/screens/HomeScreen.tsx` |
| Home page colors, spacing, card styles | `src/features/customer/styles/HomeScreen.styles.ts` |
| Sign out of an existing Firebase session | `src/features/auth/services/authService.ts` |
| Current user and session restoration | `src/features/auth/context/AuthContext.tsx` |
| Categories, subcategories and service names | `src/features/services/data/categories.ts` |
| Agricultural Vee / Tea choices | `src/features/services/data/agriculturalCrops.ts` |
| Category image references | `src/features/services/data/serviceImages.ts` |
| Category TypeScript interfaces | `src/features/services/types/category.ts` |
| Main category images | `assets/images/services/main-categories/` |
| Subcategory images | `assets/images/services/home/`, `agricultural/`, `vehicle/` |
| AI image generation prompts | `assets/image-generation/` |
| Customer profile | `src/features/customer/screens/ProfileScreen.tsx` |
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
│   │   ├── auth/              # Existing session, sign-out service and user types
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

Some screens are still placeholders: moving a screen does not implement bookings, payments, provider workflows or registration profile provisioning.

## Development

Use Node 22.13+ (22.x), then run from this folder:

```sh
npm install
npm start
npm run typecheck
npx expo export --platform web
```

The app opens directly on Home. Login, sign-up and password-reset screens have been removed. Configure `.env` only when connecting Firebase services. Existing-session checks still protect provider, booking detail and notification routes.

## Adding a feature or image

1. Put feature screens in `src/features/<feature>/screens/`.
2. Add a small route in `app/` that exports the screen. Register navigation where necessary.
3. Keep feature-specific data, components, styles and types beside that feature. Share UI through `src/components/` only when multiple features use it.
4. Save category images in the matching `assets/images/services/` folder, add a static `require` to `serviceImages.ts`, then reference it from `categories.ts`.
5. Run the TypeScript check and a relevant platform build after changing imports or routes.

For the complete repository tree, see [folder structure](../docs/folder-structure.md).
