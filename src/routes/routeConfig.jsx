import React from 'react'

const Home = React.lazy(() => import('../pages/Home/Home'))
const Catalog = React.lazy(() => import('../pages/Catalog/Catalog'))
const Studio = React.lazy(() => import('../pages/Studio/Studio'))
const Wishlist = React.lazy(() => import('../pages/Wishlist/Wishlist'))
const Bag = React.lazy(() => import('../pages/Bag/Bag'))
const ProductDetails = React.lazy(() => import('../pages/ProductDetails'))
const Search = React.lazy(() => import('../pages/Search'))

export const appRoutes = [
  { index: true, element: <Home /> },
  { path: 'men', element: <Catalog category="men" /> },
  { path: 'women', element: <Catalog category="women" /> },
  { path: 'kids', element: <Catalog category="kids" /> },
  { path: 'beauty', element: <Catalog category="beauty" /> },
  { path: 'studio', element: <Studio /> },
  { path: 'wishlist', element: <Wishlist /> },
  { path: 'bag', element: <Bag /> },
  { path: 'product/:id', element: <ProductDetails /> },
  { path: 'search', element: <Search /> },
]
