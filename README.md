# Sarthi.care

Autism screening platform for early childhood development.

## Structure

```
sarthi/
├── backend/     # Express + Prisma API server
├── mobile/      # React Native (Expo) mobile app
└── Dockerfile   # Deploys the backend
```

## Deploy (Coolify)

Connect this repo to Coolify. The root `Dockerfile` builds and runs the backend.

### Required environment variables (set in Coolify)

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/sarthi?schema=public
JWT_SECRET=<32+ char random string>
PORT=3000
DEV_OTP_BYPASS=false
MSG91_AUTHKEY=<your MSG91 auth key>
MSG91_TEMPLATE_ID=6a5d9649bc8631e68e058593
MSG91_SENDER_ID=Saarathi
MSG91_OTP_LENGTH=6
MSG91_OTP_EXPIRY=5
```

## Local development

### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### Mobile
```bash
cd mobile
npm install
# Set EXPO_PUBLIC_API_URL in mobile/.env
npx expo start
```
