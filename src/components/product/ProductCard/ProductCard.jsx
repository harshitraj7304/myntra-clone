import { useState, memo } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiShoppingBag } from 'react-icons/fi'
import useCart from '../../../hooks/useCart'
import useWishlist from '../../../hooks/useWishlist'
import ImageWithFallback from '../../ui/ImageWithFallback'

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist()
  const isWishlisted = isInWishlist(product.id)
  const [addedToBag, setAddedToBag]     = useState(false)
  const [animateHeart, setAnimateHeart] = useState(false)
  
  const { addItem } = useCart()

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
    if (!isWishlisted) {
      setAnimateHeart(true)
      setTimeout(() => setAnimateHeart(false), 800)
    }
  }

  const handleAddToBag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (addItem) {
      // Pick first size as default for quick add
      const defaultSize = product.sizes?.[0] || 'Standard'
      addItem(product, defaultSize)
      setAddedToBag(true)
      setTimeout(() => setAddedToBag(false), 1500)
    }
  }

  const hasDiscount = product.discount && product.discount > 0 && product.originalPrice

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden bg-white text-left transition-all duration-350 hover:shadow-[0_15px_30px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff3f6c] rounded-b-lg"
      aria-label={`${product.brand} – ${product.name}`}
    >
      {/* ── Image with Corner Badges ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f6]">
        <ImageWithFallback
          src={product.image}
          backupImages={product.backupImages}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* Dynamic float labels */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="rounded bg-sky-500 px-2 py-0.5 text-[9px] font-black text-white shadow-sm uppercase tracking-wide">
              NEW
            </span>
          )}
          {product.isOnSale && (
            <span className="rounded bg-[#ff3f6c] px-2 py-0.5 text-[9px] font-black text-white shadow-sm uppercase tracking-wide">
              SALE
            </span>
          )}
        </div>

        {/* Real Myntra Star Rating overlay */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded bg-white/95 px-2 py-0.5 text-[10px] font-black text-slate-800 shadow-sm backdrop-blur-[2px] z-10 select-none">
          <span>{product.rating}</span>
          <span className="text-yellow-500 text-[8px]">★</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-bold">{product.reviews}</span>
        </div>

        {/* Wishlist circle button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute right-2.5 top-2.5 flex h-8.5 w-8.5 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 active:scale-95 z-20 ${
            isWishlisted ? 'ring-1 ring-[#ff3f6c]' : ''
          }`}
        >
          <FiHeart
            size={15}
            className={`transition-all duration-300 ${
              isWishlisted ? 'fill-[#ff3f6c] text-[#ff3f6c] scale-110' : 'text-[#535766]'
            } ${animateHeart ? 'animate-ping' : ''}`}
          />
          {animateHeart && (
            <span className="absolute text-rose-500 text-[11px] font-black animate-heart-burst pointer-events-none select-none">
              ♥
            </span>
          )}
        </button>

        {/* Size Array Overlay sliding up on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 ease-out group-hover:translate-y-0 bg-white/95 backdrop-blur-[2px] py-2 px-3 flex flex-col gap-1.5 z-20">
          <div className="text-[10px] font-bold text-slate-500 truncate text-left">
            <span className="uppercase text-slate-400 font-black">Sizes: </span>
            {product.sizes?.join(', ')}
          </div>
          <button
            type="button"
            onClick={handleAddToBag}
            className={`flex w-full items-center justify-center gap-1.5 py-2 rounded text-[10px] font-black uppercase text-white tracking-widest transition-colors ${
              addedToBag
                ? 'bg-teal-600'
                : 'bg-[#ff3f6c] hover:bg-[#e8325b]'
            }`}
          >
            <FiShoppingBag size={12} />
            {addedToBag ? 'Added!' : 'Quick Add'}
          </button>
        </div>
      </div>

      {/* ── Product details ── */}
      <div className="p-3.5 space-y-1">
        {/* Brand */}
        <p className="text-[12px] font-black uppercase tracking-wider text-slate-900 leading-none">
          {product.brand}
        </p>

        {/* Name */}
        <p className="line-clamp-1 text-[12px] font-semibold text-slate-500 leading-tight">
          {product.name}
        </p>

        {/* Price Row */}
        <div className="pt-1 flex items-baseline gap-2">
          <span className="text-[13px] font-black text-slate-950">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <>
              <span className="text-[11px] text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] font-black text-orange-500">
                ({product.discount}% OFF)
              </span>
            </>
          )}
        </div>
      </div>
      {/* Dynamic Keyframes styles for high-fidelity animations */}
      <style>{`
        @keyframes heartBurst {
          0% {
            transform: scale(0.6) translateY(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.6) translateY(-14px);
            opacity: 0.9;
          }
          100% {
            transform: scale(0.9) translateY(-28px);
            opacity: 0;
          }
        }
        .animate-heart-burst {
          animation: heartBurst 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </Link>
  )
}

export default memo(ProductCard)
