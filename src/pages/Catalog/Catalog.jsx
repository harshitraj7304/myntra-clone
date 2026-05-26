import { useState, useMemo, useEffect } from 'react'
import { BiFilter } from 'react-icons/bi'
import ProductCard from '../../components/product/ProductCard/ProductCard'
import FilterPanel from '../../components/filters/FilterPanel/FilterPanel'
import SortDropdown from '../../components/filters/SortDropdown/SortDropdown'
import {
  getProductsByCategory,
  filterProducts,
  sortProducts,
  getFilterOptions,
  getPriceRange,
} from '../../services/productService'
import useDocumentTitle from '../../hooks/useDocumentTitle'

const CATALOG_METADATA = {
  men: {
    title: "Men's Wear",
    badge: "MEN'S PREMIUM COLLECTION",
    badgeColor: "text-[#ff3f6c]",
    bgGradient: "from-slate-900 via-slate-800 to-slate-950",
    textColor: "text-slate-300",
    description: "Discover precision-tailored shirts, athletic training sneakers, classic denim jackets, and everyday wardrobe essentials.",
    documentTitle: "Men's Fashion & Clothing Essentials — Myntra"
  },
  women: {
    title: "Women's Wear",
    badge: "WOMEN'S RUNWAY EDIT",
    badgeColor: "text-yellow-300",
    bgGradient: "from-rose-900 via-[#e2506e] to-rose-950",
    textColor: "text-rose-100",
    description: "Browse elegant floral summer dresses, structured western blazers, everyday straight-fit denim, and designer wear.",
    documentTitle: "Women's Fashion Clothing & Outfits — Myntra"
  },
  kids: {
    title: "Kids Department",
    badge: "PLAYTIME & FESTIVITIES",
    badgeColor: "text-yellow-200",
    bgGradient: "from-amber-600 via-orange-500 to-amber-700",
    textColor: "text-amber-50",
    description: "Colorful prints, durable sportswear, comfortable everyday denim, and festive outfits.",
    documentTitle: "Kids Fashion Wear & Toys — Myntra"
  },
  beauty: {
    title: "Beauty & Skincare",
    badge: "LUXURY GLOW & ESSENTIALS",
    badgeColor: "text-[#ff3f6c]",
    bgGradient: "from-slate-900 via-teal-800 to-slate-950",
    textColor: "text-teal-50",
    description: "Premium matte lipsticks, dermatological active serums, refreshing tonic mists, and designer grooming devices.",
    documentTitle: "Beauty & Personal Care Essentials — Myntra"
  }
}

function Catalog({ category }) {
  const meta = CATALOG_METADATA[category] || CATALOG_METADATA.men
  
  useDocumentTitle(meta.documentTitle)

  const [showFilterMobile, setShowFilterMobile] = useState(false)
  const [sortBy, setSortBy] = useState('newest')
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    brands: [],
    sizes: [],
    colors: [],
    rating: 0,
    isNew: false,
    isOnSale: false,
  })

  // Reset filters if category changes
  useEffect(() => {
    setShowFilterMobile(false)
    setSortBy('newest')
    setFilters({
      minPrice: 0,
      maxPrice: 10000,
      brands: [],
      sizes: [],
      colors: [],
      rating: 0,
      isNew: false,
      isOnSale: false,
    })
  }, [category])

  const categoryProducts = useMemo(() => getProductsByCategory(category), [category])
  
  const filterOptions = useMemo(
    () => getFilterOptions(categoryProducts),
    [categoryProducts]
  )
  
  const priceRange = useMemo(() => getPriceRange(categoryProducts), [categoryProducts])

  const filteredAndSortedProducts = useMemo(() => {
    let products = filterProducts(categoryProducts, filters)
    products = sortProducts(products, sortBy)
    return products
  }, [categoryProducts, filters, sortBy])

  return (
    <div>
      {/* Header */}
      <section className={`border-b border-slate-100 bg-gradient-to-r ${meta.bgGradient} px-4 py-16 sm:px-6 lg:px-8 text-white relative overflow-hidden`}>
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="mx-auto max-w-7xl relative z-10">
          <p className={`text-xs font-black uppercase tracking-widest ${meta.badgeColor}`}>
            {meta.badge}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white uppercase sm:text-5xl">
            {meta.title}
          </h1>
          <p className={`mt-3.5 max-w-2xl text-sm font-semibold leading-relaxed ${meta.textColor}`}>
            {meta.description} Explore {categoryProducts.length} selected picks.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Sidebar Filter - Desktop */}
          <aside className="hidden rounded-lg border border-slate-200 bg-white p-6 lg:block">
            <FilterPanel
              onFiltersChange={setFilters}
              filterOptions={filterOptions}
              priceRange={priceRange}
            />
          </aside>

          {/* Products Section */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="text-sm text-slate-600 font-bold">
                Showing {filteredAndSortedProducts.length} products
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilterMobile(!showFilterMobile)}
                  className="flex lg:hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-slate-50 transition active:scale-95"
                >
                  <BiFilter />
                  Filter
                </button>

                <SortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Mobile Filter Panel */}
            {showFilterMobile && (
              <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 lg:hidden">
                <FilterPanel
                  onFiltersChange={setFilters}
                  filterOptions={filterOptions}
                  priceRange={priceRange}
                />
              </div>
            )}

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg bg-slate-50 border border-dashed border-slate-200">
                <div className="text-center">
                  <p className="text-lg font-black text-slate-950">
                    No products found
                  </p>
                  <p className="mt-2 text-sm text-slate-500 font-semibold">
                    Try adjusting your filters or resetting categories
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Catalog
