# Luxe Wear

A premium luxury fashion e-commerce platform built with React, TypeScript, and modern web technologies. Features a sophisticated UI with smooth animations, complete shopping cart functionality, and a seamless checkout experience.

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite)

## Features

- **Product Catalog** - Browse products with filtering by category, price range, and search
- **Product Details** - Image gallery with zoom, size/color selection, related products
- **Shopping Cart** - Add/remove items, quantity controls, persistent cart state
- **Wishlist** - Save favorite items for later
- **Checkout Flow** - Multi-step checkout with form validation
- **User Authentication** - Login/register with demo credentials
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Smooth Animations** - Page transitions, scroll animations, micro-interactions
- **Toast Notifications** - User feedback for actions

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand (cart, wishlist, auth)
- **Data Fetching**: TanStack Query
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Icons**: Lucide React
- **API**: FakeStore API (product data)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/luxe-wear.git
cd luxe-wear
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── home/           # Homepage sections
│   ├── layout/         # Navbar, Footer, Cart Drawer
│   ├── products/       # Product cards, gallery, filters
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and constants
├── pages/              # Page components
├── services/           # API services
├── store/              # Zustand stores
└── types/              # TypeScript type definitions
```

## Demo Credentials

For testing the authentication flow:
- **Email**: demo@luxewear.com
- **Password**: demo123

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001/api
VITE_USE_BACKEND=false
```

Set `VITE_USE_BACKEND=true` to use the optional backend server.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Screenshots

### Homepage
![Homepage](screenshots/home.png)

### Shop Page
![Shop](screenshots/shop.png)

### Product Detail
![Product](screenshots/product.png)

### Cart
![Cart](screenshots/cart.png)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Product images from [Unsplash](https://unsplash.com)
- Product data from [FakeStore API](https://fakestoreapi.com)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com)
