import { FiTrash2, FiShoppingBag, FiHeart } from 'react-icons/fi'
import ProductCard from '../../components/product/ProductCard/ProductCard'
import { products } from '../../data/products'
import useWishlist from '../../hooks/useWishlist'
import useCart from '../../hooks/useCart'
import ImageWithFallback from '../../components/ui/ImageWithFallback'

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addItem } = useCart()

  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id))

  const moveToCart = (product) => {
    addItem(product)
    removeFromWishlist(product.id)
  }

  return (
    <div>
      {/* Header */}
      <section className="border-b border-slate-200 bg-gradient-to-br from-slate-50 to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <FiHeart className="text-4xl text-rose-600" />
            <h1 className="text-4xl font-black text-slate-950">My Wishlist</h1>
          </div>
          <p className="mt-3 text-slate-600">
            {wishlistItems.length} items saved
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {wishlistProducts.length === 0 ? (
          <div className="flex h-96 items-center justify-center">
            <div className="text-center">
              <FiHeart className="mx-auto text-6xl text-slate-300" />
              <h2 className="mt-4 text-2xl font-black text-slate-950">
                Your wishlist is empty
              </h2>
              <p className="mt-2 text-slate-600">
                Save your favorite items to your wishlist
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950">
                Saved Items ({wishlistProducts.length})
              </h2>
            </div>

            <div className="grid gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-6 rounded-lg border border-slate-200 bg-white p-4 transition hover:shadow-lg"
                >
                  {/* Product Image */}
                  <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <ImageWithFallback
                      src={product.image}
                      backupImages={product.backupImages}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        {product.brand}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {product.name}
                      </p>

                      {/* Rating */}
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${
                                i < Math.round(product.rating)
                                  ? 'text-yellow-400'
                                  : 'text-slate-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-slate-600">
                          ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-bold text-slate-950">
                          Rs. {product.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          Rs. {product.originalPrice}
                        </span>
                        <span className="text-xs font-semibold text-orange-600">
                          {product.discount}% OFF
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => moveToCart(product)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 py-2 text-sm font-bold text-white transition hover:shadow-md"
                      >
                        <FiShoppingBag className="text-lg" />
                        Move to Bag
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Wishlist
