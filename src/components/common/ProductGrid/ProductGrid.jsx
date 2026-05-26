import ProductCard from '../../product/ProductCard/ProductCard'

function ProductGrid({ products = [], title, description }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {title && (
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-black text-slate-950">{title}</h2>
          {description && <p className="text-slate-600">{description}</p>}
        </div>
      )}

      {products.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg bg-slate-50">
          <p className="text-center text-slate-600">No products found</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProductGrid
