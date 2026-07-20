# Sarthi.care Backend

Node/Express + Prisma + SQLite backend for the Sarthi.care mobile app.

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
```

## Run

```bash
npm run dev
```

Server starts on `http://localhost:3000`.

## SMS setup

The backend sends OTPs via **MSG91**.

Add these values to your `.env`:

```env
MSG91_AUTHKEY=your_authkey
MSG91_TEMPLATE_ID=your_dlt_template_id
MSG91_SENDER_ID=your_sender_id
MSG91_OTP_LENGTH=6
MSG91_OTP_EXPIRY=5
```

### Dev bypass

For local screen development without MSG91, set:

```env
DEV_OTP_BYPASS=true
```

This skips real SMS and returns the OTP in the API response so you can continue building other screens. Remove it or set to `false` in production.

- `MSG91_AUTHKEY` is found in your MSG91 dashboard.
- `MSG91_TEMPLATE_ID` is your DLT-approved OTP template ID.
- `MSG91_SENDER_ID` is optional; the template usually defines the sender.

## API endpoints

- `POST /api/auth/otp/request` — sends an OTP to the phone number via MSG91
- `POST /api/auth/otp/verify` — verify OTP and receive JWT token
- `POST /api/profile/caregiver` — create/update caregiver profile (auth required)
- `POST /api/profile/child` — create child profile (auth required)
- `GET /api/profile/children` — list child profiles (auth required)
- `GET /api/users/me` — get current user with profiles (auth required)

## Mobile connection

When testing with Expo Go on a phone, replace `localhost` in the mobile `.env` with your computer's local IP:

```
EXPO_PUBLIC_API_URL=http://192.168.1.x:3000/api
```

Then restart the Expo dev server.
