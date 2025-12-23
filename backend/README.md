# LuxeShare Backend API

A complete Node.js/Express backend for the LuxeShare e-commerce platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT + Passport.js (Google & GitHub OAuth)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Prerequisites

1. **PostgreSQL**: Install and run PostgreSQL locally
2. **Node.js**: Version 18 or higher

## Getting Started

### 1. Setup Database

Create a PostgreSQL database:

```bash
createdb luxeshare
```

### 2. Environment Configuration

Copy the example env file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string (min 32 characters)
- OAuth credentials (optional for social login)

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Migrations

```bash
npm run migrate
```

### 5. Seed Initial Data

Seed categories and demo user:
```bash
npm run seed
```

Import products from FakeStore API:
```bash
npm run seed:fakestore
```

### 6. Start Development Server

```bash
npm run dev
```

Server runs on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout (revoke refresh token)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth login
- `GET /api/auth/github` - GitHub OAuth login

### Products
- `GET /api/products` - List products (pagination, filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/search?q=` - Search products
- `GET /api/products/featured` - Featured products
- `GET /api/products/new-arrivals` - New arrivals
- `GET /api/products/best-sellers` - Best sellers
- `GET /api/products/on-sale` - Sale products

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:slug` - Category with products

### Orders (Auth required)
- `GET /api/orders` - User's orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/products/:productId/reviews` - Product reviews
- `POST /api/reviews/products/:productId/reviews` - Create review (Auth)
- `PUT /api/reviews/:id` - Update review (Auth)
- `DELETE /api/reviews/:id` - Delete review (Auth)
- `POST /api/reviews/:id/vote` - Vote helpful (Auth)

### Cart (Auth required)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove from cart
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/sync` - Sync local cart with server

### Wishlist (Auth required)
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist
- `POST /api/wishlist/sync` - Sync with server

### Addresses (Auth required)
- `GET /api/addresses` - List addresses
- `POST /api/addresses` - Create address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `PUT /api/addresses/:id/default` - Set as default

## Frontend Integration

To connect the frontend to this backend:

1. Create `.env` in frontend root:
```
VITE_API_URL=http://localhost:3001/api
VITE_USE_BACKEND=true
```

2. Restart frontend dev server

## Demo Credentials

After seeding, you can login with:
- Email: `demo@luxeshare.com`
- Password: `demo123`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed initial data
- `npm run seed:fakestore` - Import products from FakeStore API

## Project Structure

```
backend/
├── src/
│   ├── config/         # Database, Passport, CORS config
│   ├── controllers/    # Request handlers
│   ├── db/
│   │   ├── migrations/ # SQL migrations
│   │   └── seeds/      # Seed data
│   ├── middleware/     # Auth, validation, error handling
│   ├── repositories/   # Database queries
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Helpers, logger
│   ├── validators/     # Zod schemas
│   ├── app.ts          # Express app setup
│   └── index.ts        # Entry point
├── scripts/            # Utility scripts
├── .env.example        # Environment template
├── package.json
└── tsconfig.json
```
