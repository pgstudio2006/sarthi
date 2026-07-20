# Sarthi.care Project Context

> **Expo note:** Always read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any Expo code.

## Project Overview

Sarthi.care is a guided child-development support app for Android and iOS. It helps parents and caregivers move from concern to action through screening, profile setup, next-step guidance, and follow-up. The brand personality is reassuring, clear, and compassionate — design should reduce anxiety and build trust.

- Product doc: `PRODUCT.md`
- Execution plan: `MVP_Timeline.md`
- Figma/audit/reference materials are in the top-level folders under `c:\Users\Parthrajsinh Gohil\Documents\sarthi.care`

## Workspace Layout

- `sarthi-mobile/` — React Native (Expo) mobile app
- `sarthi-backend/` — Node/Express + Prisma + SQLite backend API
- `screens/` — exported Figma PNG/SVG assets used as design source
- `PRODUCT.md` / `MVP_Timeline.md` — product and timeline docs

## Tech Stack

### Mobile (`sarthi-mobile/`)

- Expo SDK ~54.0.34, React Native 0.81.5, React 19.1.0, TypeScript ~5.9.2
- Navigation: `@react-navigation/native` + `@react-navigation/native-stack`
- Fonts: `Inter_400Regular`, `Inter_500Medium`, `Inter_600SemiBold`, `Inter_700Bold`, `Inter_800ExtraBold` from `@expo-google-fonts/inter`
- State: React Context (`AuthContext`) + `AsyncStorage` token persistence
- HTTP: `fetch` wrapper in `sarthi-mobile/api/client.ts`
- Safe area: `react-native-safe-area-context`
- Android nav bar styling: `expo-navigation-bar`
- SVGs: `react-native-svg` + `react-native-svg-transformer`

### Backend (`sarthi-backend/`)

- Node.js, Express 5.1, TypeScript 5.9, Prisma 6.6, SQLite
- Validation: Zod
- Auth: JWT (`jsonwebtoken`) with 30-day expiry
- SMS OTP: MSG91 (`https://control.msg91.com/api/v5/otp`)
- Dev bypass: `DEV_OTP_BYPASS=true` skips real SMS and returns the OTP in the API response

## Design & UI Conventions

- Figma base frame is **390 x 844**. All sizes are scaled with `useResponsive` (`sarthi-mobile/utils/responsive.ts`):
  - `scaleSize(size)` for layout/spacing
  - `scaleFont(size)` for text sizes and line heights
  - `padding` is `FIGMA_PADDING * scale` (24px base)
  - Avoid hardcoded absolute values
- Use `ScreenLayout` (`sarthi-mobile/components/ScreenLayout.tsx`) for every screen. It provides safe area, keyboard avoiding, scroll view, header, and footer.
  - `header` — React node for the top bar (e.g. `Frame80Svg`)
  - `footer` — React node for bottom primary action (e.g. `PrimaryButton`)
  - `keyboardAvoiding` / `scrollable` / `bottomPadding` optional
- Header bars: `Frame80Svg` assets for phone auth/OTP screens
  - Phone auth: `sarthi-mobile/assets/screen6/frame80.svg`
  - OTP verification: `sarthi-mobile/assets/screen7/frame80.svg`
- Theme colors: `sarthi-mobile/theme/colors.ts`
  - `primaryBlue` `#535BD8` — primary buttons, accent
  - `mainBlack` `#2D2A3A` — headings
  - `grey` `#6B7180` — secondary text
  - `errorRed` `#D32F2F` — errors
  - `privacyGreen` `#228C45` / `privacyGreenLight` `#ECF7EC` — privacy/info cards
- `PrimaryButton` (`sarthi-mobile/components/PrimaryButton.tsx`) is fixed height 54, border radius 28, white label on `primaryBlue`.
- `PrivacyInfoCard` (`sarthi-mobile/components/PrivacyInfoCard.tsx`) supports `title`/`subtitle` or `message`, `icon`, `backgroundColor`, `borderRadius`, `textAlign`, `titleColor`, `messageWeight`.
- Phone number UI captures 10 digits; the API is called with `+91XXXXXXXXXX` and the display is `+91 XXXXX XXXXX`.
- Screen assets are exported to `sarthi-mobile/assets/screenN/` and imported as SVG or PNG.

## Mobile App Entry & Navigation

- `sarthi-mobile/App.tsx` loads fonts, sets Android navigation bar colors, reads `onboardingCompleted` from `AsyncStorage`, and sets up the stack.
- `initialRouteName` is `PhoneAuth` if onboarding is done, otherwise `Splash`.
- Stack screens implemented so far: `Splash`, `Welcome`, `LanguageSelection`, `PhoneAuth`, `OTPVerification`, `CreateProfile`, `CreateCaregiverProfile`, `DoctorProfile`, `OtherProfile`, `ProfileSettings`, `NextOnboarding`, `NextSteps`, `Home`, `BeginScreening`, `AutismScreening`, `SocialScreening`, `EmotionScreening`, `BehaviorScreening`, `SpeechScreening`, `CognitiveScreening`, `SensoryScreening`, `ScreeningCompletion`, `ScreeningReport`, `SimpleResults`, `SaveExit`.
- Remaining Figma screens (~25) still need to be implemented to reach the 50-screen target.
- `AuthProvider` wraps the navigator; `useAuth` provides `user`, `token`, `signIn`, `signOut`, and `loading`.

## Frontend Auth Flow

- `PhoneAuthScreen` (`sarthi-mobile/screens/PhoneAuthScreen.tsx`) uses `ScreenLayout`, `Frame80Svg`, `PhoneNumberInput`, `PrimaryButton`, `PrivacyInfoCard`.
  - Calls `requestOtp(`+91${phone}`)`
  - On success navigates to `OTPVerification` with `phoneNumber` and `devOtp`
- `OTPVerificationScreen` (`sarthi-mobile/screens/OTPVerificationScreen.tsx`) currently uses manual `SafeAreaView`, `KeyboardAvoidingView`, `ScrollView`, `TopHeader`, `ChevronLeftIcon`, `OTPInput`, `CountdownTimer`, `PrivacyInfoCard`, `PrimaryButton`.
  - Normalizes phone to `+91` + 10 digits
  - Pre-fills OTP from `route.params.devOtp` when bypass is enabled
  - Calls `verifyOtp(apiPhone, otp)`, then `signIn(token, user)` and navigates to `CreateProfile`
  - Resend calls `requestOtp(apiPhone)`
  - **Pending:** refactor to use `ScreenLayout` and `Frame80Svg` from `sarthi-mobile/assets/screen7/frame80.svg`, with sizes scaled like `PhoneAuthScreen`
- `AuthContext` (`sarthi-mobile/context/AuthContext.tsx`) stores the token in `AsyncStorage` and restores the user via `getMe()` on app start.

## API Client

- `sarthi-mobile/api/client.ts` exports typed functions:
  - `requestOtp(phone)` → `{ success, message, devOtp? }`
  - `verifyOtp(phone, code)` → `{ token, user }`
  - `getMe()` → `{ user }`
  - `createCaregiverProfile(input)` → `{ profile }`
  - `createChildProfile(input)` → `{ child }`
  - `getChildren()` → `{ children }`
- `API_BASE_URL = process.env.EXPO_PUBLIC_API_URL` with fallback `http://localhost:3000/api`
- `User` type: `id, phone, createdAt, updatedAt, caregiverProfile, children`
- Every function returns `ApiResponse<T>` = `{ success: true; data: T } | { success: false; error: string }`

## Backend API

- Entry: `sarthi-backend/src/index.ts`
  - Express + CORS + JSON parser
  - Routes: `app.use('/api/auth', authRoutes)`, `'/api/profile', profileRoutes`, `'/api/users', userRoutes`
  - Health check: `GET /health`
- `sarthi-backend/prisma/schema.prisma`:
  - `User` (id, phone, caregiverProfile, children, otps)
  - `CaregiverProfile` (name, role, email, location, relation, speciality, institution, userId)
  - `ChildProfile` (name, dateOfBirth, gender, birthContext, ageInMonths, userId)
  - `Otp` (phone, code, expiresAt, used, createdAt)
- `sarthi-backend/src/lib/prisma.ts` — `PrismaClient` singleton
- `sarthi-backend/src/lib/auth.ts` — `generateToken(user)` and `verifyToken(token)`; JWT payload contains `userId` and `phone`; 30-day expiry
- `sarthi-backend/src/middleware/auth.ts` — `requireAuth` validates `Authorization: Bearer <token>` and attaches `req.user`
- `sarthi-backend/src/routes/auth.ts`:
  - `POST /api/auth/otp/request` — creates OTP, sends via MSG91 unless `DEV_OTP_BYPASS` is true
  - `POST /api/auth/otp/verify` — validates OTP, marks used, finds or creates `User`, returns `{ success: true, token, user }` with `caregiverProfile` and `children` included
- `sarthi-backend/src/routes/profile.ts` (auth required):
  - `POST /api/profile/caregiver` — upsert caregiver profile
  - `POST /api/profile/child` — create child profile
  - `GET /api/profile/children` — list current user's children
- `sarthi-backend/src/routes/users.ts`:
  - `GET /api/users/me` — current user with profiles

## OTP & SMS

- `sarthi-backend/src/lib/otp.ts` generates a 6-digit code, stores it for 5 minutes, and marks it used on validation.
- `sarthi-backend/src/lib/sms.ts` sends via MSG91 with query params: `template_id`, `mobile`, `otp`, `otp_length`, `otp_expiry`, `realTimeResponse`, and optional `sender`.
- `DEV_OTP_BYPASS=true` in `sarthi-backend/.env` causes `/api/auth/otp/request` to return `{ devOtp: code }` and skip MSG91. Use this for local screen development.
- In production, set `DEV_OTP_BYPASS=false` (or remove) and fill `MSG91_AUTHKEY`, `MSG91_TEMPLATE_ID`, and optionally `MSG91_SENDER_ID`.

## Environment Variables

### Mobile (`sarthi-mobile/.env`)

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

Use the local machine IP when testing on a real device with Expo Go.

### Backend (`sarthi-backend/.env`)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="192.168.1.3"
PORT=3000

DEV_OTP_BYPASS=true

MSG91_AUTHKEY=""
MSG91_TEMPLATE_ID=""
MSG91_SENDER_ID=""
MSG91_OTP_LENGTH="6"
MSG91_OTP_EXPIRY="5"
```

## Deployment Plans

- Backend is planned for a **Hostinger VPS with Coolify**; it will serve both Android and iOS clients.
- Mobile is an Expo-managed project; production builds will be generated for Google Play Store and Apple App Store.

## Current Status / Pending Work

- Implemented:
  - **Backend scaffold** (`sarthi-backend/`): Prisma schema, JWT auth, OTP request/verify, caregiver/child profile CRUD
  - **Frontend API client** (`sarthi-mobile/api/client.ts`) and `AuthContext` with `AsyncStorage` token persistence
  - **Auth & onboarding screens**
    - `PhoneAuthScreen` wired to `requestOtp` and using `ScreenLayout` / `Frame80Svg`
    - `OTPVerificationScreen` wired to `verifyOtp`, pre-fills `devOtp` in dev bypass mode
    - `Splash`, `Welcome`, `LanguageSelection`
    - `CreateProfile`, `CreateCaregiverProfile`, `DoctorProfile`, `OtherProfile`, `ProfileSettings` — UI ready, **not yet wired to API**
    - `NextOnboarding`, `NextSteps`
  - **Home / core screens**
    - `HomeScreen` — UI ready, **not yet wired**
  - **Screening flow screens (UI implemented)**
    - `BeginScreening`, `AutismScreening`, `SocialScreening`, `EmotionScreening`, `BehaviorScreening`, `SpeechScreening`, `CognitiveScreening`, `SensoryScreening`
    - `ScreeningCompletion`, `SimpleResults`, `SaveExit`
    - `ScreeningReportScreen` refactored to match Figma screen28: top-insights carousel with pagination dots, per-domain Attention/Strengths toggle tabs with numbered lists, updated Learn More article cards, and swapped primary/secondary footer actions
  - **Reusable UI components**: `ScreenLayout`, `PrimaryButton`, `PrivacyInfoCard`, `PhoneNumberInput`, `OTPInput`, `CountdownTimer`, etc.
- Pending:
  - Wire `CreateCaregiverProfileScreen` to `createCaregiverProfile`
  - Wire `CreateProfileScreen` to `createChildProfile`
  - Wire `HomeScreen` to real user/child data
  - Wire all screening screens to backend assessment/scoring APIs
  - Define and implement screening scoring + result calculation
  - Verify `ScreeningReportScreen` with `npx tsc --noEmit` and `npx eslint .` (blocked by a stuck `tsc` process in the previous session; rerun and remove `screens/ScreeningReportScreen.new.tsx` if still present)
  - Implement remaining ~25 Figma screens to reach the 50-screen target
  - End-to-end testing, device testing, production builds, store submission

## Conventions for Future Changes

- Always use `useResponsive` and `ScreenLayout` for new screens.
- Keep API calls in `sarthi-mobile/api/client.ts` and keep `AuthContext` updated after auth/profile changes.
- Add backend routes in `sarthi-backend/src/routes/` and register them in `sarthi-backend/src/index.ts`.
- Use Zod for request validation.
- Never expose `JWT_SECRET`, `MSG91_AUTHKEY`, or other backend secrets in the mobile app.
- Use `npx tsc --noEmit` in both `sarthi-mobile` and `sarthi-backend` to check TypeScript before finishing.

## Troubleshooting

- If `Property 'errorRed' does not exist` appears, add `errorRed: '#D32F2F'` to `sarthi-mobile/theme/colors.ts`.
- If OTP verification fails with a type mismatch, make sure backend `auth.ts` returns `user` with `caregiverProfile` and `children` included.
- For mobile connection to backend on a real device, replace `localhost` in `sarthi-mobile/.env` with the dev machine's local IP and restart the Expo server.
