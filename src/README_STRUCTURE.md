# Frontend Folder Structure

This React frontend uses a feature-friendly structure for a Myntra-style fashion ecommerce website.

## Folders

- `assets/` stores static project assets such as images, icons, and brand media.
- `components/common/` stores shared app chrome such as `Navbar` and `Footer`.
- `components/product/` stores product-specific reusable components such as `ProductCard`.
- `components/ui/` stores small reusable UI primitives such as buttons, inputs, badges, and loaders.
- `context/` stores React Context objects and providers for global frontend state.
- `data/` stores mock data used before a backend is connected.
- `hooks/` stores reusable custom React hooks.
- `layouts/` stores page shells such as `MainLayout`.
- `pages/` stores route-level pages such as `Home`, `ProductListing`, `ProductDetails`, `Cart`, and `Wishlist`.
- `routes/` stores route configuration such as `AppRoutes`.
- `services/` stores API-facing functions. These can later call the backend without changing page components.

## Naming Conventions

- Use `PascalCase` for React components and component folders: `ProductCard/ProductCard.jsx`.
- Use `camelCase` for hooks, services, and data files: `useDocumentTitle.js`, `productService.js`.
- Use `index.js` files only for simple exports from component or page folders.
- Keep route pages inside `pages/` and smaller reusable pieces inside `components/`.
- Keep backend-ready data access inside `services/`, even when it returns mock data for now.
