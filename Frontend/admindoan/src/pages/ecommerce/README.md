# Ecommerce Frontend Integration Guide

This folder contains components and pages for customer-facing ecommerce functionality that integrates with your existing Smart Home backend APIs.

## Components Structure

- **components/ecommerce/** - Contains UI components reused across ecommerce pages
- **pages/ecommerce/** - Contains page components for the ecommerce section
- **pages/ecommerce/routes.tsx** - Contains route definitions for ecommerce pages

## How to Integrate with Existing Admin App

To integrate the ecommerce routes with the existing admin application, follow these steps:

### 1. Import the ecommerce routes in your main App.tsx file

```tsx
// Import at the top of App.tsx
import { ecommerceRoutes } from './pages/ecommerce/routes';
```

### 2. Add the ecommerce routes to your router configuration

```tsx
const router = createBrowserRouter([
  // Existing admin routes...
  
  // Add ecommerce routes
  ...ecommerceRoutes,
  
  // Catch-all route
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  }
]);
```

### 3. Install Font Awesome for icons

The ecommerce UI components use Font Awesome icons. Add this to your index.html:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />
```

### 4. Install react-helmet for SEO (if not already installed)

```bash
npm install react-helmet
npm install @types/react-helmet --save-dev
```

## Features Implemented

- Product listing with sorting and filtering
- Product detail page
- Category browsing
- Product search
- Responsive design for mobile and desktop

## Features to Implement Later

- Shopping cart
- User authentication
- Checkout process
- Order history
- Wishlists

## Notes on API Integration

The components have been designed to work with your existing backend APIs. The following API services are currently used:

- `sanPhamService` for product data
- `getAllDanhMuc` for category data

Additional APIs can be integrated as needed for features like cart, checkout, etc. 