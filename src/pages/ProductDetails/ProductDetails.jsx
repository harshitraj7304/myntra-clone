import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiHeart, FiShoppingBag, FiTruck, FiShield, FiRefreshCw, FiChevronLeft } from 'react-icons/fi'
import { getProductById, getProductsByCategory } from '../../services/productService'
import useCart from '../../hooks/useCart'
import useWishlist from '../../hooks/useWishlist'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import ProductCard from '../../components/product/ProductCard/ProductCard'
import ImageWithFallback from '../../components/ui/ImageWithFallback'

function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  // Fetch product
  const product = useMemo(() => getProductById(parseInt(id)), [id])

  // Set document title dynamically
  useDocumentTitle(product ? `Buy ${product.brand} ${product.name} Online — Myntra` : 'Product Not Found')

  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [pincode, setPincode] = useState('')
  const [pincodeChecked, setPincodeChecked] = useState(false)
  const [pincodeMessage, setPincodeMessage] = useState('')
  const [activeTab, setActiveTab] = useState('details')
  const [sizeError, setSizeError] = useState(false)
  const [addedToBag, setAddedToBag] = useState(false)
  const [activeImage, setActiveImage] = useState('')
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 })
  const [isZooming, setIsZooming] = useState(false)

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomPos({ x, y })
  }

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0)
    setSelectedSize(null)
    setSizeError(false)
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0])
    }
    if (product) {
      setActiveImage(product.image)
    }
  }, [id, product])

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-slate-950">Product Not Found</h1>
        <p className="mt-3 text-slate-600">The product you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-6 py-3 font-bold text-white transition hover:bg-rose-700"
        >
          <FiChevronLeft /> Back to Home
        </Link>
      </div>
    )
  }

  const isWishlisted = isInWishlist(product.id)
  const isAlreadyInCart = isInCart(product.id)

  // Fetch similar products
  const similarProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true)
      // Scroll slightly to sizes section or alert
      return
    }
    setSizeError(false)
    addItem(product, selectedSize)
    setAddedToBag(true)
    setTimeout(() => setAddedToBag(false), 2000)
  }

  const handleCheckPincode = (e) => {
    e.preventDefault()
    if (!pincode.trim() || pincode.length < 6) {
      setPincodeMessage('Please enter a valid 6-digit pincode')
      setPincodeChecked(true)
      return
    }
    const days = Math.floor(Math.random() * 3) + 2 // 2 to 4 days
    setPincodeMessage(`Delivery by Wed, 28th May | Shipping Charge ₹49 (FREE on orders above ₹500)`)
    setPincodeChecked(true)
  }

  const hasDiscount = product.discount && product.discount > 0 && product.originalPrice

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <nav className="mx-auto max-w-7xl px-4 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:px-6 lg:px-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-rose-600 transition-colors">Home</Link>
          </li>
          <li>/</li>
          <li>
            <Link to={`/${product.category}`} className="hover:text-rose-600 transition-colors">{product.category}</Link>
          </li>
          <li>/</li>
          <li className="text-slate-900 truncate max-w-[200px]" aria-current="page">
            {product.brand} {product.name}
          </li>
        </ol>
      </nav>

      {/* Main product display */}
      <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Images Section */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-[3/4] overflow-hidden rounded-xl bg-[#f5f5f6] ring-1 ring-[#e9e9eb] cursor-zoom-in"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <ImageWithFallback
                src={activeImage}
                backupImages={product.backupImages?.filter(img => img !== activeImage)}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-200"
                style={isZooming ? { transform: 'scale(2.2)', transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
              />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="rounded-full bg-sky-500 px-3 py-1 text-xs font-bold text-white shadow-md">NEW</span>
                )}
                {product.isOnSale && (
                  <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white shadow-md">SALE</span>
                )}
              </div>
            </div>

            {/* Thumbnail Images list (Dynamic variants mock) */}
            <div className="grid grid-cols-4 gap-3">
              {[product.image, ...(product.backupImages || [])].filter(Boolean).map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-[3/4] overflow-hidden rounded-lg bg-slate-100 ring-2 cursor-pointer transition ${
                    activeImage === img ? 'ring-rose-500' : 'ring-transparent hover:ring-slate-300 hover:scale-[1.02]'
                  }`}
                >
                  <ImageWithFallback src={img} alt={`Variant ${i+1}`} className="h-full w-full object-cover brightness-95 hover:brightness-100" />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide text-slate-950">{product.brand}</h1>
              <p className="mt-1 text-lg text-slate-600 font-medium">{product.name}</p>

              {/* Rating pill */}
              <div className="mt-3.5 inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-bold text-slate-800 shadow-sm">
                <span className="flex items-center gap-0.5 text-yellow-500">
                  ★ {product.rating}
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-600 font-semibold">{product.reviews} Ratings</span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Pricing Details */}
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-slate-950">₹{product.price.toLocaleString('en-IN')}</span>
                {hasDiscount && (
                  <>
                    <span className="text-base text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    <span className="text-lg font-bold text-orange-500">({product.discount}% OFF)</span>
                  </>
                )}
              </div>
              <p className="text-xs font-bold text-teal-600">inclusive of all taxes</p>
            </div>

            {/* Colors Section */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-slate-950 uppercase tracking-wider">Select Color</p>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-full border-2 px-4 py-1.5 text-xs font-bold transition ${
                        selectedColor === color
                          ? 'border-rose-600 bg-rose-50 text-rose-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Section */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-950 uppercase tracking-wider">Select Size</p>
                <button className="text-xs font-bold text-[#ff3f6c] uppercase hover:underline">Size Chart</button>
              </div>

              {sizeError && (
                <div className="rounded-lg bg-rose-50 p-2.5 text-xs font-bold text-rose-600 animate-bounce">
                  ⚠️ Please select a size before adding to Cart
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size)
                      setSizeError(false)
                    }}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-black transition-all ${
                      selectedSize === size
                        ? 'border-rose-600 bg-rose-600 text-white shadow-md'
                        : 'border-slate-200 text-slate-950 bg-white hover:border-rose-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action CTA Buttons */}
            <div className="flex gap-4 pt-3">
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={isAlreadyInCart}
                className={`flex flex-1 items-center justify-center gap-3.5 rounded-lg py-4 text-[15px] font-black uppercase tracking-wider text-white shadow-md transition-all active:scale-[0.98] ${
                  isAlreadyInCart
                    ? 'bg-teal-600 cursor-not-allowed shadow-none'
                    : addedToBag
                    ? 'bg-teal-600'
                    : 'bg-gradient-to-r from-rose-600 to-rose-700 hover:shadow-lg'
                }`}
              >
                <FiShoppingBag className="text-lg" />
                {isAlreadyInCart ? 'Already in Bag' : addedToBag ? 'Added to Bag!' : 'Add to Bag'}
              </button>

              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center justify-center rounded-lg border-2 px-6 shadow-sm transition active:scale-95 ${
                  isWishlisted
                    ? 'border-rose-600 bg-rose-50 text-[#ff3f6c]'
                    : 'border-slate-300 hover:border-slate-400 bg-white text-slate-800'
                }`}
              >
                <FiHeart className={`text-xl ${isWishlisted ? 'fill-[#ff3f6c]' : ''}`} />
                <span className="ml-2.5 text-[14px] font-bold uppercase tracking-wider">
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </span>
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Delivery/Pincode Estimator */}
            <div className="space-y-3.5">
              <p className="text-sm font-bold text-slate-950 uppercase tracking-wider">Delivery Options</p>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter a PIN code"
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold outline-none transition focus:border-rose-600"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-950 px-6 font-black uppercase text-white hover:bg-slate-800 transition"
                >
                  Check
                </button>
              </form>
              {pincodeChecked && (
                <p className="flex items-start gap-1.5 text-xs font-semibold leading-normal text-slate-600">
                  <FiTruck className="mt-0.5 shrink-0 text-slate-800 text-sm" />
                  <span>{pincodeMessage}</span>
                </p>
              )}
            </div>

            {/* Brand benefits */}
            <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-4.5 text-center text-xs font-bold text-slate-800">
              <div className="space-y-1.5 flex flex-col items-center">
                <FiShield className="text-xl text-teal-600" />
                <span>100% Original</span>
              </div>
              <div className="space-y-1.5 flex flex-col items-center">
                <FiRefreshCw className="text-xl text-teal-600" />
                <span>30 Day Returns</span>
              </div>
              <div className="space-y-1.5 flex flex-col items-center">
                <FiTruck className="text-xl text-teal-600" />
                <span>Fast Delivery</span>
              </div>
            </div>

            {/* Specifications Tab details */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
              <div className="flex border-b border-slate-200 text-sm font-bold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex-1 py-3 text-center border-b-2 transition ${
                    activeTab === 'details' ? 'border-rose-600 text-rose-600 bg-rose-50/20' : 'border-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('material')}
                  className={`flex-1 py-3 text-center border-b-2 transition ${
                    activeTab === 'material' ? 'border-rose-600 text-rose-600 bg-rose-50/20' : 'border-transparent text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Material & Care
                </button>
              </div>

              <div className="p-5 text-sm leading-relaxed text-slate-600">
                {activeTab === 'details' ? (
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                    <div className="border-b border-slate-100 pb-1.5">
                      <dt className="text-xs font-bold text-slate-400 uppercase">Brand</dt>
                      <dd className="text-sm font-bold text-slate-800 mt-0.5">{product.brand}</dd>
                    </div>
                    <div className="border-b border-slate-100 pb-1.5">
                      <dt className="text-xs font-bold text-slate-400 uppercase">Subcategory</dt>
                      <dd className="text-sm font-bold text-slate-800 mt-0.5 capitalize">{product.subcategory}</dd>
                    </div>
                    <div className="border-b border-slate-100 pb-1.5">
                      <dt className="text-xs font-bold text-slate-400 uppercase">Tags</dt>
                      <dd className="text-sm font-bold text-slate-800 mt-0.5 capitalize">{product.tags?.join(', ')}</dd>
                    </div>
                    <div className="border-b border-slate-100 pb-1.5">
                      <dt className="text-xs font-bold text-slate-400 uppercase">Stock Level</dt>
                      <dd className="text-sm font-bold text-slate-800 mt-0.5">{product.stock} left in stock</dd>
                    </div>
                  </dl>
                ) : (
                  <div className="space-y-2">
                    <p><strong className="text-slate-800">Material:</strong> {product.material || 'Premium Fabrics'}</p>
                    <p><strong className="text-slate-800">Care Instructions:</strong> Machine wash cold, tumble dry low, do not bleach. Iron medium heat.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Similar Products section */}
        {similarProducts.length > 0 && (
          <section className="mt-20 border-t border-slate-200 pt-16">
            <div className="mb-10">
              <h2 className="text-2xl font-black text-slate-950 uppercase tracking-wider">Similar Products</h2>
              <p className="mt-1.5 text-sm text-slate-500">Handpicked items of a similar category and brand</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default ProductDetails
