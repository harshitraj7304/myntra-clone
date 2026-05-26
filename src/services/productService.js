import { products } from '../data/products'

export function getProductsByCategory(category) {
  return products.filter((p) => p.category === category)
}

export function getProductById(id) {
  return products.find((p) => p.id === id)
}

export function searchProducts(query) {
  const lowerQuery = query.toLowerCase().trim()
  if (!lowerQuery) return []
  
  return products.filter((p) => {
    // Exact category match
    if (lowerQuery === 'men' || lowerQuery === 'mens' || lowerQuery === "men's" || lowerQuery === 'male') {
      if (p.category === 'men') return true
    }
    if (lowerQuery === 'women' || lowerQuery === 'womens' || lowerQuery === "women's" || lowerQuery === 'female') {
      if (p.category === 'women') return true
    }
    if (lowerQuery === 'kids' || lowerQuery === 'kid' || lowerQuery === "kids'" || lowerQuery === 'child' || lowerQuery === 'boys' || lowerQuery === 'girls') {
      if (p.category === 'kids') return true
    }
    if (lowerQuery === 'beauty' || lowerQuery === 'makeup' || lowerQuery === 'cosmetics' || lowerQuery === 'skincare') {
      if (p.category === 'beauty') return true
    }
    if (lowerQuery === 'home' || lowerQuery === 'decor' || lowerQuery === 'bedsheet' || lowerQuery === 'bedding') {
      if (p.category === 'home') return true
    }
    if (lowerQuery === 'footwear' || lowerQuery === 'shoes' || lowerQuery === 'sneakers' || lowerQuery === 'running shoes') {
      if (p.category === 'footwear') return true
    }
    
    // Comprehensive text matching
    return (
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      p.subcategory.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  })
}

export function filterProducts(products, filters = {}) {
  let filtered = [...products]

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    filtered = filtered.filter((p) => {
      if (filters.minPrice !== undefined && p.price < filters.minPrice)
        return false
      if (filters.maxPrice !== undefined && p.price > filters.maxPrice)
        return false
      return true
    })
  }

  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter((p) => filters.brands.includes(p.brand))
  }

  if (filters.sizes && filters.sizes.length > 0) {
    filtered = filtered.filter((p) =>
      filters.sizes.some((size) => p.sizes.includes(size)),
    )
  }

  if (filters.colors && filters.colors.length > 0) {
    filtered = filtered.filter((p) =>
      filters.colors.some((color) => p.colors.includes(color)),
    )
  }

  if (filters.rating !== undefined) {
    filtered = filtered.filter((p) => p.rating >= filters.rating)
  }

  if (filters.isNew) {
    filtered = filtered.filter((p) => p.isNew)
  }

  if (filters.isOnSale) {
    filtered = filtered.filter((p) => p.isOnSale)
  }

  return filtered
}

export function sortProducts(products, sortBy = 'newest') {
  const sorted = [...products]

  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.reverse()
    case 'discount':
      return sorted.sort((a, b) => b.discount - a.discount)
    default:
      return sorted
  }
}

export function getFilterOptions(categoryProducts = products) {
  const brands = [...new Set(categoryProducts.map((p) => p.brand))]
  const sizes = [...new Set(categoryProducts.flatMap((p) => p.sizes))]
  const colors = [...new Set(categoryProducts.flatMap((p) => p.colors))]

  return { brands, sizes, colors }
}

export function getPriceRange(categoryProducts = products) {
  const prices = categoryProducts.map((p) => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}

export function getFeaturedProducts() {
  return products.filter((p) => p.isFeatured).slice(0, 4)
}

export function getNewProducts(limit = 8) {
  return products.filter((p) => p.isNew).slice(0, limit)
}

export function getOnSaleProducts(limit = 8) {
  return products.filter((p) => p.isOnSale).slice(0, limit)
}
