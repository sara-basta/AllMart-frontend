# AllMart Frontend 🛍️

[![Angular](https://img.shields.io/badge/Angular-Latest-red?style=flat-square&logo=angular)](https://angular.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)](https://nodejs.org)

A responsive e-commerce storefront and administration dashboard built with Angular. It features dual checkout workflows (guest and authenticated), JWT-based authentication, and real-time cart state management.

---

## 🎯 Hero Showcase

![Fast Checkout Workflow](./assets/fastcheckout.gif)

---

## ✨ Features

### Customer Experience
- **Product Catalog**: Infinite scroll, filtering, and category search.
- **Cart Management**: Real-time state updates with persistent session storage.
- **Dual Checkout Workflows**:
  - Guest checkout with minimal friction.
  - Authenticated checkout for registered users.
- **Stripe Integration**: Secure card payment processing and tokenization.
- **Order Management**: Order tracking and history.
- **Wishlist**: Persistent product favorites.

### Security & Admin
- **JWT Authentication**: Secure API communication via Angular `HttpInterceptor`.
- **Admin Dashboard**:
  - Product catalog and category management.
  - Order monitoring and fulfillment tracking.
  - Image uploads integrated with Cloudinary.
- **Role-Based Access Control**: Route guards protecting admin operations.
- **Responsive Design**: Mobile, tablet, and desktop optimized layouts.

---

## 📸 UI Gallery

<details>
<summary><strong>🖼️ Click to expand screenshot gallery</strong></summary>

### Cart & State Management
![Cart & State Management](./assets/cart-state.gif)

### Main Product Catalog
![Main Product Catalog](./assets/catalog.png)

### Admin Dashboard - Products
![Admin Dashboard - Products](./assets/admin.png)

### Mobile Responsive View
![Mobile Responsive View](./assets/mobile.png)

</details>

---

## 📋 Prerequisites

Before setting up the project, ensure the following are installed:

- **Node.js**: Version 18.x or higher
- **Angular CLI**: Version 21.x or higher

Verify installations:
```bash
node --version
ng version
```

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AllMart-frontend
```

### 2. Install Dependencies
```bash
npm install
```

---

## ⚙️ Environment Configuration

Configure environment variables for API connectivity and Stripe.

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  stripePublicKey: 'pk_test_YOUR_STRIPE_PUBLIC_KEY_HERE'
};
```

---

## 🔨 Development Server

Start the local development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application automatically reloads on source file changes.

---

## 📦 Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── guards/          # Route protection (admin, guest)
│   │   ├── interceptors/    # JWT authentication interceptor
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # API and state logic (Auth, Cart, Product)
│   ├── features/            # Feature modules (Catalog, Checkout, Admin)
│   ├── shared/              # Reusable UI components
│   └── environments/        # Environment configurations
├── index.html               
└── styles.css               # Global styles
```

---

## 🔐 Security

- **JWT HttpInterceptor**: Automatically attaches Bearer tokens to outgoing API requests.
- **Route Guards**: Prevents unauthorized access to /admin routes.
- **Stripe Elements**: Client-side tokenization keeps raw card data off your server.

---

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `ng serve` | Start development server |
| `ng build` | Build for production |
| `ng test` | Run unit tests |
| `ng e2e` | Run end-to-end tests |
