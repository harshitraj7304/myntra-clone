import { mensProducts } from './mensProducts'
import { womensProducts } from './womensProducts'
import { kidsProducts } from './kidsProducts'
import { beautyProducts } from './beautyProducts'
import { homeProducts } from './homeProducts'
import { footwearProducts } from './footwearProducts'
import { trendingProducts } from './trendingProducts'

export const products = [
  ...mensProducts,
  ...womensProducts,
  ...kidsProducts,
  ...beautyProducts,
  ...homeProducts,
  ...footwearProducts,
  ...trendingProducts
]

export const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4)
