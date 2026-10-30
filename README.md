# Redux Mini Shop

A responsive e-commerce application built with **React, TypeScript, Redux Toolkit and RTK Query**.

The project demonstrates modern React development practices, centralized state management, API integration, CRUD operations, optimistic updates and persistent client-side state.

## Live Demo

- **Live Application:** Add your Vercel URL here
- **GitHub Repository:** https://github.com/salamar-ss/redux-mini-shop.git

## Features

### Product Management
- Fetch products from a REST API.
- Add new products.
- Edit existing products.
- Delete products.
- Search products by name.
- Filter products by price.
- Loading and error states.
- Empty search results state.

### Shopping Cart
- Add products to the cart.
- Remove products from the cart.
- Track product quantities.
- Calculate the total price.
- Clear the cart.
- Persist cart data using localStorage.
- Restore cart data after page reload.

### State Management
- Redux Toolkit for centralized application state.
- RTK Query for API requests and caching.
- createSlice for shopping cart state.
- Typed Redux hooks.
- Optimistic cache updates.
- Rollback on failed mutations.

### User Interface
- Responsive product grid.
- Minimal and clean design.
- Product cards.
- Search and filter controls.
- Loading, error and empty states.
- Responsive layout for desktop, tablet and mobile.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | UI development |
| TypeScript | Static typing |
| Redux Toolkit | Global state management |
| RTK Query | API requests and caching |
| React Redux | React and Redux integration |
| Vite | Development environment and build tool |
| CSS | Styling and responsive layout |
| DummyJSON | REST API for product data |

## Project Structure

```text
src/
├── app/
│   ├── store.ts
│   └── hooks.ts
│
├── features/
│   ├── products/
│   │   ├── productsApi.ts
│   │   └── ProductList.tsx
│   │
│   └── cart/
│       ├── cartSlice.ts
│       └── Cart.tsx
│
├── App.tsx
├── main.tsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate to the project directory:

```bash
cd redux-mini-shop
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL provided by Vite.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build the application |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

## API

This project uses the [DummyJSON Products API](https://dummyjson.com/docs/products).

Available operations:

| Operation | Endpoint | Method |
|---|---|---|
| Fetch products | `/products?limit=10` | GET |
| Add product | `/products/add` | POST |
| Update product | `/products/:id` | PATCH |
| Delete product | `/products/:id` | DELETE |

**Important:** DummyJSON simulates write operations. Products added, edited or deleted through the API are not permanently stored on the server. The application updates its local RTK Query cache to demonstrate CRUD functionality. Reloading the page restores the original API data.

Shopping cart data is stored separately in the browser using localStorage.

## Key Concepts Demonstrated