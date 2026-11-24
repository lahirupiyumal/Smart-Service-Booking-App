# Complete source structure

Dependency folders and generated output are omitted. Empty feature folders contain `.gitkeep` files.

```text
smart-service-booking/
├── admin-dashboard/
│   ├── src/
│   │   ├── components/
│   │   ├── config/
│   │   │   └── firebase.ts
│   │   ├── hooks/
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx
│   │   ├── pages/
│   │   │   └── ManagementPage.tsx
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── .DS_Store
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
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
│   │   ├── auth/
│   │   │   └── index.ts
│   │   ├── bookings/
│   │   │   └── index.ts
│   │   ├── notifications/
│   │   │   └── index.ts
│   │   ├── payments/
│   │   │   └── index.ts
│   │   ├── providers/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── .DS_Store
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── mobile-app/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── forgot-password.tsx
│   │   │   ├── login.tsx
│   │   │   └── register.tsx
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
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/
│   │   │   │   └── InfoCard.tsx
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── PlaceholderScreen.tsx
│   │   │   ├── forms/
│   │   │   │   └── TextField.tsx
│   │   │   └── layout/
│   │   │       └── Screen.tsx
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── firebase.ts
│   │   ├── constants/
│   │   │   └── categories.ts
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── bookings/
│   │   │   ├── customer/
│   │   │   ├── favorites/
│   │   │   ├── notifications/
│   │   │   ├── payments/
│   │   │   ├── provider/
│   │   │   ├── reviews/
│   │   │   └── services/
│   │   ├── hooks/
│   │   ├── schemas/
│   │   ├── services/
│   │   │   ├── auth/
│   │   │   │   └── authService.ts
│   │   │   ├── booking/
│   │   │   ├── firebase/
│   │   │   ├── notification/
│   │   │   └── payment/
│   │   ├── theme/
│   │   │   └── index.ts
│   │   ├── types/
│   │   │   └── user.ts
│   │   └── utils/
│   ├── .DS_Store
│   ├── .env.example
│   ├── app.json
│   ├── expo-env.d.ts
│   ├── package.json
│   └── tsconfig.json
├── smart-service-booking/
├── .DS_Store
├── .gitignore
├── .nvmrc
├── README.md
├── firebase.json
└── package.json
```
