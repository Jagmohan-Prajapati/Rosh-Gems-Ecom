# RoshGems

Luxury gemstone e-commerce platform for the Indian market, built with React, Vite, Express, Prisma, PostgreSQL, and Razorpay.

## Overview

RoshGems is a full-stack gemstone storefront designed for premium product discovery, secure checkout, OTP-based authentication, and admin-side product and order management. The project uses a custom luxury UI while following the proven backend architecture of JaseerGems, adapted for INR currency and the RoshGems brand.

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS v4
- React Router DOM
- Motion
- Zustand
- Lucide React
- TypeScript

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- jose (JWT)
- bcrypt
- Nodemailer
- Cloudinary
- Razorpay

## Key Features

- Luxury gemstone product catalog
- Product search and filtering
- Cart with persisted state
- OTP-based account registration
- Forgot password with OTP reset
- JWT auth using httpOnly cookies
- Saved addresses and account management
- Razorpay checkout in INR
- Admin dashboard
- Product CRUD with Cloudinary image upload
- Order management and status updates

## Project Structure

```bash
src/
├── components/
├── context/
├── lib/
├── pages/
└── store/

prisma/
server.ts
vite.config.ts
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
APP_URL=
DATABASE_URL=
JWT_SECRET=
ADMIN_EMAIL=
ADMIN_PASSWORD_HASH=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EMAIL_USER=
EMAIL_PASS=
NODE_ENV=development
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Development Notes

- Currency is INR throughout the project
- Admin authentication is handled through environment variables
- Registration is OTP-only
- Railway deployment uses `process.env.PORT`
- Frontend UI is derived from Google Stitch exported HTML pages

## Status

In active development.

## License

MIT
