import { useMemo } from 'react'
import HeroBanner from '../../components/sections/HeroBanner'
import TrendingCategories from '../../components/sections/TrendingCategories'
import DealsSection from '../../components/sections/DealsSection'
import ProductGrid from '../../components/common/ProductGrid/ProductGrid'
import { getFeaturedProducts, getNewProducts } from '../../services/productService'
import { trendingCategories } from '../../data/categories'
import { flashDeals } from '../../data/deals'
import useDocumentTitle from '../../hooks/useDocumentTitle'

function Home() {
  useDocumentTitle('Myntra — Online Shopping for Fashion & Lifestyle')

  const featuredProducts = useMemo(() => getFeaturedProducts(), [])
  const newProducts      = useMemo(() => getNewProducts(8), [])

  return (
    <div>
      <HeroBanner />

      <DealsSection deals={flashDeals} />

      <TrendingCategories categories={trendingCategories} />

      <ProductGrid
        products={featuredProducts}
        title="Featured Products"
        description="Handpicked items selected just for you"
      />

      <ProductGrid
        products={newProducts}
        title="New Arrivals"
        description="Fresh styles just added to our collection"
      />
    </div>
  )
}

export default Home
