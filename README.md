# ResellHub

A full-stack marketplace platform for buying and selling pre-owned items. Built with Next.js 16, Express, and MongoDB.

---

## Screenshots

> Add your screenshots to `/public/screenshots/` and they'll appear here.

 Home                                 
 ------------------------------------ 
 ![Home](public//home.png) 



## Features

### Buyers

- Browse and search listings with filters (category, condition, sort)
- Paginated product grid and list view (12 per page)
- Product detail page with image carousel
- Add to cart and checkout with Stripe
- Wishlist / saved items
- Order tracking with status updates
- Cancel orders (Pending / Accepted / Processing only)
- Write reviews on purchased products
- Compare up to 3 products side by side (price, condition, category, stock, seller)
- Report suspicious or misleading listings with reason selection
- View public seller profiles with listings, ratings, and reviews

### Sellers

- Dashboard overview with analytics charts
- Add, edit, and delete product listings (up to 4 images via Cloudinary)
- Manage incoming orders — Accept, Reject, update delivery status
- View buyer contact info (name, email, phone, address, location) per order
- Blocked accounts lose access to cart and add-product

### Admin

- User management — view, update role / status, delete
- Product management — approve, reject, flag reported listings
- Order management — view all orders with transaction IDs, forward-only status updates
- Reports panel — review, resolve, or dismiss reported listings
- Platform analytics — user growth, revenue, category performance

### General

- Email + password authentication via better-auth
- Google OAuth sign-in
- Dark / light mode toggle (persists in localStorage)
- Fully responsive — mobile, tablet, desktop
- Toaster notifications (react-hot-toast)

---

## Tech Stack

### Core Framework

| Package     | Version | Purpose                              |
| ----------- | ------- | ------------------------------------ |
| `next`      | 16.2.9  | App Router, SSR, routing, API routes |
| `react`     | 19.2.4  | UI library                           |
| `react-dom` | 19.2.4  | DOM rendering                        |

### Styling & UI

| Package                | Version | Purpose                              |
| ---------------------- | ------- | ------------------------------------ |
| `tailwindcss`          | ^4      | Utility-first CSS framework          |
| `@tailwindcss/postcss` | ^4      | PostCSS integration for Tailwind v4  |
| `@heroui/react`        | ^3.2.1  | Pre-built UI component library       |
| `@heroui/styles`       | ^3.2.1  | HeroUI base styles                   |
| `animate.css`          | ^4.1.1  | CSS animation classes (navbar, hero) |

### Icons

| Package             | Version | Purpose                                                       |
| ------------------- | ------- | ------------------------------------------------------------- |
| `react-icons`       | ^5.6.0  | Icon sets — `fi` (Feather), `bs` (Bootstrap), `md` (Material) |
| `@gravity-ui/icons` | ^2.18.0 | Additional icon set                                           |

### Authentication

| Package                      | Version | Purpose                                        |
| ---------------------------- | ------- | ---------------------------------------------- |
| `better-auth`                | ^1.6.20 | Auth framework — email/password + Google OAuth |
| `@better-auth/mongo-adapter` | ^1.6.20 | MongoDB adapter for better-auth sessions       |

### Payments

| Package                   | Version | Purpose                               |
| ------------------------- | ------- | ------------------------------------- |
| `stripe`                  | ^22.2.2 | Stripe Node.js SDK (server-side)      |
| `@stripe/stripe-js`       | ^9.8.0  | Stripe.js browser client              |
| `@stripe/react-stripe-js` | ^6.6.0  | React hooks and components for Stripe |

### Database

| Package   | Version | Purpose                                          |
| --------- | ------- | ------------------------------------------------ |
| `mongodb` | ^7.3.0  | MongoDB Node.js driver (used in Express backend) |

### Animations & Interaction

| Package                | Version | Purpose                                 |
| ---------------------- | ------- | --------------------------------------- |
| `gsap`                 | ^3.15.0 | Advanced scroll and timeline animations |
| `swiper`               | ^12.2.0 | Touch-friendly image carousel / slider  |
| `react-type-animation` | ^3.2.0  | Typewriter effect on hero section       |

### Data & Feedback

| Package           | Version | Purpose                                          |
| ----------------- | ------- | ------------------------------------------------ |
| `recharts`        | ^3.8.1  | Charts for admin and seller analytics dashboards |
| `react-hot-toast` | ^2.6.0  | Toast notifications                              |

### Backend (Express server)

| Package   | Purpose                                                   |
| --------- | --------------------------------------------------------- |
| `express` | REST API server                                           |
| `cors`    | Cross-origin request handling between Next.js and Express |
| `mongodb` | Direct Atlas connection for all DB operations             |
| `stripe`  | Stripe webhook handling and payment intent creation       |

### Dev Tools

| Package                       | Version | Purpose                      |
| ----------------------------- | ------- | ---------------------------- |
| `eslint`                      | ^9      | Linting                      |
| `eslint-config-next`          | 16.2.9  | Next.js ESLint ruleset       |
| `babel-plugin-react-compiler` | 1.0.0   | React compiler optimizations |

### External Services

| Service       | Purpose                          |
| ------------- | -------------------------------- |
| MongoDB Atlas | Cloud database                   |
| Cloudinary    | Product image hosting and upload |
| Stripe        | Payment processing               |
| Google OAuth  | Social login                     |

---

## Project Structure

```
resell_hub/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & signup pages
│   │   ├── dashboard/
│   │   │   ├── buyer/          # Orders, wishlist, payments, profile
│   │   │   ├── seller/         # Products, orders, analytics
│   │   │   └── admin/          # Users, products, orders, reports, analytics
│   │   ├── products/           # Product listing & detail pages
│   │   ├── sellers/[id]/       # Public seller profile (email-based routing)
│   │   ├── compare/            # Side-by-side product comparison
│   │   ├── cart/               # Shopping cart
│   │   └── checkout/           # Stripe checkout
│   ├── components/
│   │   ├── home/               # Hero, featured listings, testimonials, etc.
│   │   ├── dashboard/          # Sidebar shell, status badges
│   │   └── compare/            # Floating compare bar
│   ├── context/
│   │   ├── CartContext.jsx     # Cart state (localStorage per user)
│   │   └── CompareContext.jsx  # Compare list (max 3, localStorage)
│   └── lib/
│       ├── auth.js             # better-auth server config
│       ├── auth-client.js      # better-auth client hooks
│       └── api/                # Fetch helpers (products, orders, reviews, reports…)
└── public/
    └── screenshots/            # Add your screenshots here
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Stripe account
- Google OAuth credentials (optional)
- Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/tanvir-22/resell-hub.git
cd resell-hub
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resellhub

# better-auth
BETTER_AUTH_SECRET=your-secret-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-preset
```

### 4. Configure the Express backend

Create a `.env` in your backend folder:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/resellhub
NEXT_URL=http://localhost:3000
```

### 5. Start development servers

**Frontend:**

```bash
npm run dev
```

**Backend** (in your backend folder):

```bash
node index.js
```

The app runs at `http://localhost:3000`.

---

## Order Status Flow

```
Pending → Accepted → Processing → Shipped → Delivered
   └─────────────────────────────────────→ Cancelled
```

- Buyers can cancel during: **Pending**, **Accepted**, **Processing**
- Sellers move orders forward; can reject at **Pending**
- Admin updates are forward-only — **Delivered** and **Cancelled** are locked

## Report Flow

```
User submits report → Pending
Admin reviews       → Reviewed
Admin closes        → Resolved  or  Dismissed
```

---

## Live Demo

> Add your deployed URL here.

---

## Author

**Tanvir** — [GitHub](https://github.com/tanvir-22)
