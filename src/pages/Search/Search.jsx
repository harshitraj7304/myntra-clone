import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BiFilter } from 'react-icons/bi'
import { FiSearch } from 'react-icons/fi'
import ProductCard from '../../components/product/ProductCard/ProductCard'
import FilterPanel from '../../components/filters/FilterPanel/FilterPanel'
import SortDropdown from '../../components/filters/SortDropdown/SortDropdown'
import {
  searchProducts,
  filterProducts,
  sortProducts,
  getFilterOptions,
  getPriceRange,
} from '../../services/productService'
import useDocumentTitle from '../../hooks/useDocumentTitle'

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  
  useDocumentTitle(`Search Results for ${query || 'Fashion'} — Myntra`)

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

  // Get matching products for query
  const searchResults = useMemo(() => searchProducts(query), [query])

  const filterOptions = useMemo(
    () => getFilterOptions(searchResults),
    [searchResults],
  )
  const priceRange = useMemo(() => getPriceRange(searchResults), [searchResults])

  const filteredAndSortedProducts = useMemo(() => {
    let items = filterProducts(searchResults, filters)
    items = sortProducts(items, sortBy)
    return items
  }, [searchResults, filters, sortBy])

  return (
    <div>
      {/* Header */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-wide text-[#ff3f6c]">
            Search Console
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {query ? `Search Results for "${query}"` : 'Explore Catalogue'}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-6 text-slate-600">
            We found {searchResults.length} matching products in our store. Use the filters below to refine your search.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {searchResults.length > 0 ? (
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
                <div className="text-sm font-bold text-slate-600">
                  Showing {filteredAndSortedProducts.length} of {searchResults.length} products
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setShowFilterMobile(!showFilterMobile)}
                    className="flex lg:hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-950"
                  >
                    <BiFilter className="text-lg" />
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
                <div className="flex h-64 items-center justify-center rounded-lg bg-slate-50">
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-950">
                      No matching products
                    </p>
                    <p className="mt-2 text-slate-600">
                      Try adjusting your search filters.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-8">
            <div className="text-center max-w-sm space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <FiSearch className="text-3xl text-slate-400" />
              </div>
              <h2 className="text-2xl font-black text-slate-950">
                No Results Found
              </h2>
              <p className="text-sm text-slate-600">
                We couldn&apos;t find anything matching &quot;{query}&quot;. Check the spelling, try a broader search, or browse our active departments.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Link to="/men" className="rounded-lg bg-slate-950 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition">Shop Men</Link>
                <Link to="/women" className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-750 transition">Shop Women</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
