# Complete source structure

Generated dependencies, local environment files and build output are omitted. See [the mobile editing guide](../mobile-app/README.md) for the files to edit for each feature.

```text
Smart-Service-Booking-App/
├── docs/
│   ├── architecture.md
│   ├── database-schema.md
│   └── folder-structure.md
├── firebase/
│   ├── firestore.indexes.json
│   ├── firestore.rules
│   └── storage.rules
├── functions/
│   ├── src/
│   │   └── index.ts
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── mobile-app/
│   ├── app/
│   │   ├── (customer)/
│   │   │   ├── _layout.tsx
│   │   │   ├── bookings.tsx
│   │   │   ├── explore.tsx
│   │   │   ├── favorites.tsx
│   │   │   ├── index.tsx
│   │   │   └── profile.tsx
│   │   ├── (provider)/
│   │   │   ├── _layout.tsx
│   │   │   ├── availability.tsx
│   │   │   ├── earnings.tsx
│   │   │   ├── index.tsx
│   │   │   ├── requests.tsx
│   │   │   └── services.tsx
│   │   ├── booking/
│   │   │   ├── [id].tsx
│   │   │   └── create.tsx
│   │   ├── provider/
│   │   │   └── [id].tsx
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── notifications.tsx
│   ├── assets/
│   │   ├── image-generation/
│   │   │   ├── crop-prompts.json
│   │   │   ├── main-category-prompts.json
│   │   │   ├── prompts.json
│   │   │   └── subcategory-prompts.json
│   │   └── images/
│   │       └── services/
│   │           ├── agricultural/
│   │           │   ├── harvesting.png
│   │           │   ├── land-preparation.png
│   │           │   ├── tea.png
│   │           │   └── vee.png
│   │           ├── home/
│   │           │   ├── ac-repair.png
│   │           │   ├── carpentry.png
│   │           │   ├── cleaning.png
│   │           │   ├── construction.png
│   │           │   ├── electrical.png
│   │           │   ├── gardening.png
│   │           │   ├── painting.png
│   │           │   └── plumbing.png
│   │           ├── main-categories/
│   │           │   ├── agricultural-services.png
│   │           │   ├── home-services.png
│   │           │   └── vehicle-services.png
│   │           └── vehicle/
│   │               ├── battery-services.png
│   │               ├── tire-services.png
│   │               ├── towing.png
│   │               ├── vehicle-electrical.png
│   │               ├── vehicle-repair.png
│   │               ├── vehicle-servicing.png
│   │               └── vehicle-washing.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/
│   │   │   │   └── InfoCard.tsx
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── PlaceholderScreen.tsx
│   │   │   │   └── ServiceIcon.tsx
│   │   │   └── layout/
│   │   │       └── Screen.tsx
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── firebase.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── context/
│   │   │   │   │   └── AuthContext.tsx
│   │   │   │   ├── services/
│   │   │   │   │   └── authService.ts
│   │   │   │   └── types/
│   │   │   │       └── user.ts
│   │   │   ├── bookings/
│   │   │   │   └── screens/
│   │   │   │       ├── BookingDetailsScreen.tsx
│   │   │   │       ├── BookingsScreen.tsx
│   │   │   │       └── CreateBookingScreen.tsx
│   │   │   ├── customer/
│   │   │   │   ├── screens/
│   │   │   │   │   ├── HomeScreen.tsx
│   │   │   │   │   └── ProfileScreen.tsx
│   │   │   │   ├── services/
│   │   │   │   │   └── profileStorage.ts
│   │   │   │   ├── styles/
│   │   │   │   │   ├── HomeScreen.styles.ts
│   │   │   │   │   └── ProfileScreen.styles.ts
│   │   │   │   └── types/
│   │   │   │       └── profile.ts
│   │   │   ├── favorites/
│   │   │   │   └── screens/
│   │   │   │       └── FavoritesScreen.tsx
│   │   │   ├── notifications/
│   │   │   │   └── screens/
│   │   │   │       └── NotificationsScreen.tsx
│   │   │   ├── provider/
│   │   │   │   └── screens/
│   │   │   │       ├── AvailabilityScreen.tsx
│   │   │   │       ├── EarningsScreen.tsx
│   │   │   │       ├── ProviderDashboardScreen.tsx
│   │   │   │       ├── ProviderProfileScreen.tsx
│   │   │   │       ├── ProviderServicesScreen.tsx
│   │   │   │       └── RequestsScreen.tsx
│   │   │   └── services/
│   │   │       ├── data/
│   │   │       │   ├── agriculturalCrops.ts
│   │   │       │   ├── categories.ts
│   │   │       │   └── serviceImages.ts
│   │   │       ├── screens/
│   │   │       │   └── ExploreScreen.tsx
│   │   │       └── types/
│   │   │           └── category.ts
│   │   ├── navigation/
│   │   │   ├── CustomerTabs.tsx
│   │   │   ├── EntryRedirect.tsx
│   │   │   ├── ProviderTabs.tsx
│   │   │   └── RootNavigator.tsx
│   │   └── theme/
│   │       └── index.ts
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   ├── app.json
│   ├── expo-env.d.ts
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
├── .nvmrc
├── README.md
├── firebase.json
└── package.json
```
