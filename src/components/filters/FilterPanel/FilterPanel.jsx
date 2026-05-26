import { useState } from 'react'
import { BiChevronDown, BiX } from 'react-icons/bi'

function FilterPanel({ onFiltersChange, filterOptions, priceRange }) {
  const [filters, setFilters] = useState({
    minPrice: priceRange?.min || 0,
    maxPrice: priceRange?.max || 10000,
    brands: [],
    sizes: [],
    colors: [],
    rating: 0,
    isNew: false,
    isOnSale: false,
  })

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    brand: true,
    size: false,
    color: false,
    rating: false,
  })

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleMultiSelect = (key, value) => {
    const current = filters[key] || []
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]
    handleFilterChange(key, updated)
  }

  const handleClearFilters = () => {
    const cleared = {
      minPrice: priceRange?.min || 0,
      maxPrice: priceRange?.max || 10000,
      brands: [],
      sizes: [],
      colors: [],
      rating: 0,
      isNew: false,
      isOnSale: false,
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-950">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="border-b border-slate-200 pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between font-bold text-slate-950"
        >
          Price
          <BiChevronDown
            className={`transition ${
              expandedSections.price ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.price && (
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-600">
                Min Price: ₹{filters.minPrice}
              </label>
              <input
                type="range"
                min={priceRange?.min || 0}
                max={priceRange?.max || 10000}
                value={filters.minPrice}
                onChange={(e) =>
                  handleFilterChange('minPrice', parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-600">
                Max Price: ₹{filters.maxPrice}
              </label>
              <input
                type="range"
                min={priceRange?.min || 0}
                max={priceRange?.max || 10000}
                value={filters.maxPrice}
                onChange={(e) =>
                  handleFilterChange('maxPrice', parseInt(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Brand */}
      {filterOptions?.brands && filterOptions.brands.length > 0 && (
        <div className="border-b border-slate-200 pb-6">
          <button
            onClick={() => toggleSection('brand')}
            className="flex w-full items-center justify-between font-bold text-slate-950"
          >
            Brand
            <BiChevronDown
              className={`transition ${
                expandedSections.brand ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.brand && (
            <div className="mt-4 space-y-3 max-h-48 overflow-y-auto">
              {filterOptions.brands.slice(0, 8).map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleMultiSelect('brands', brand)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-600">{brand}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Size */}
      {filterOptions?.sizes && filterOptions.sizes.length > 0 && (
        <div className="border-b border-slate-200 pb-6">
          <button
            onClick={() => toggleSection('size')}
            className="flex w-full items-center justify-between font-bold text-slate-950"
          >
            Size
            <BiChevronDown
              className={`transition ${
                expandedSections.size ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.size && (
            <div className="mt-4 flex flex-wrap gap-2">
              {filterOptions.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleMultiSelect('sizes', size)}
                  className={`rounded border px-3 py-1.5 text-sm font-semibold transition ${
                    filters.sizes.includes(size)
                      ? 'border-rose-600 bg-rose-50 text-rose-600'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Color */}
      {filterOptions?.colors && filterOptions.colors.length > 0 && (
        <div className="border-b border-slate-200 pb-6">
          <button
            onClick={() => toggleSection('color')}
            className="flex w-full items-center justify-between font-bold text-slate-950"
          >
            Color
            <BiChevronDown
              className={`transition ${
                expandedSections.color ? 'rotate-180' : ''
              }`}
            />
          </button>

          {expandedSections.color && (
            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
              {filterOptions.colors.map((color) => (
                <label
                  key={color}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color)}
                    onChange={() => handleMultiSelect('colors', color)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-600">{color}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rating */}
      <div className="border-b border-slate-200 pb-6">
        <button
          onClick={() => toggleSection('rating')}
          className="flex w-full items-center justify-between font-bold text-slate-950"
        >
          Rating
          <BiChevronDown
            className={`transition ${
              expandedSections.rating ? 'rotate-180' : ''
            }`}
          />
        </button>

        {expandedSections.rating && (
          <div className="mt-4 space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="rating"
                  checked={filters.rating === rating}
                  onChange={() => handleFilterChange('rating', rating)}
                  className="h-4 w-4"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < rating
                          ? 'text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-slate-600">& up</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Sale Status */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isOnSale}
            onChange={(e) => handleFilterChange('isOnSale', e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold text-slate-950">
            On Sale
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.isNew}
            onChange={(e) => handleFilterChange('isNew', e.target.checked)}
            className="h-4 w-4"
          />
          <span className="text-sm font-semibold text-slate-950">
            New Arrival
          </span>
        </label>
      </div>
    </div>
  )
}

export default FilterPanel
