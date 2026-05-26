import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiTruck, FiRefreshCw, FiShield, FiHeadphones } from 'react-icons/fi'
import ImageWithFallback from '../ui/ImageWithFallback'

const SLIDES = [
  {
    id: 1,
    badge: '🔥 Limited Time Offer',
    headline: "Discover Fashion's\nHottest Trends",
    sub: 'Explore our curated collection of premium fashion, beauty, and lifestyle products. Save up to 60% on selected items today.',
    cta: { label: 'Shop Men', path: '/men' },
    ctaSecondary: { label: 'Shop Women', path: '/women' },
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    floatA: { value: '50% OFF', desc: 'On Summer Collection' },
    floatB: { value: '🎁 Free Shipping', desc: 'On orders above ₹500' },
    gradientFrom: '#fff5f7',
    gradientTo: '#f0f4ff',
  },
  {
    id: 2,
    badge: '✨ New Season',
    headline: "Premium Men's\nFashion Edit",
    sub: 'Discover shirts, sneakers, jackets, and everyday essentials for a modern wardrobe. Brand new arrivals every week.',
    cta: { label: 'Explore Men', path: '/men' },
    ctaSecondary: { label: 'View Deals', path: '/men' },
    image: 'https://images.unsplash.com/photo-1552062407-291826ab63d3?auto=format&fit=crop&w=800&q=80',
    floatA: { value: 'New In', desc: 'Fresh Arrivals Daily' },
    floatB: { value: '⭐ Top Rated', desc: '4.5+ rated products' },
    gradientFrom: '#f0fffe',
    gradientTo: '#fff8f0',
  },
  {
    id: 3,
    badge: '💎 Exclusive Deals',
    headline: "Women's Style\nRedefined",
    sub: "From casual chic to elegant evening wear — explore thousands of women's styles from top brands at unbeatable prices.",
    cta: { label: 'Shop Women', path: '/women' },
    ctaSecondary: { label: 'Kids Collection', path: '/kids' },
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=800&q=80',
    floatA: { value: '40–70% OFF', desc: 'On Women\'s Wear' },
    floatB: { value: '🌟 Trending', desc: 'This season\'s picks' },
    gradientFrom: '#fdf4ff',
    gradientTo: '#f0f6ff',
  },
]

const PROMO_ITEMS = [
  { icon: FiTruck,       title: 'Free Delivery',    desc: 'On orders above ₹500' },
  { icon: FiRefreshCw,   title: 'Easy Returns',     desc: '30-day hassle-free returns' },
  { icon: FiShield,      title: 'Secure Payments',  desc: '100% safe & protected' },
  { icon: FiHeadphones,  title: '24/7 Support',     desc: 'Round-the-clock help' },
]

function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 500)
  }, [animating])

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length)
  }, [current, goTo])

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length)
  }, [current, goTo])

  /* Auto-advance every 4s */
  useEffect(() => {
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next])

  const slide = SLIDES[current]

  return (
    <div>
      {/* ── Carousel ─────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden transition-colors duration-700"
        style={{
          background: `linear-gradient(135deg, ${slide.gradientFrom} 0%, ${slide.gradientTo} 100%)`,
        }}
        aria-label="Featured promotions"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 md:min-h-[440px] md:grid-cols-2 lg:px-8 lg:py-20">
          {/* Left: text */}
          <div
            key={slide.id}
            className="space-y-5"
            style={{
              animation: 'fadeSlideIn 0.5s ease forwards',
            }}
          >
            <div>
              <span className="mb-3 inline-block rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ff3f6c] shadow-sm backdrop-blur-sm">
                {slide.badge}
              </span>
              <h1 className="text-4xl font-black leading-[1.15] text-[#1a1a1a] sm:text-5xl lg:text-[3.25rem]">
                {slide.headline.split('\n').map((line, i) => (
                  <span key={i}>
                    {i === 0 ? line : <><br /><span className="text-myntra-gradient">{line}</span></>}
                  </span>
                ))}
              </h1>
            </div>

            <p className="max-w-md text-base leading-relaxed text-[#535766]">
              {slide.sub}
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to={slide.cta.path}
                className="inline-flex items-center gap-2 rounded-lg bg-[#ff3f6c] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#e8325b] hover:shadow-lg active:scale-[0.98]"
              >
                {slide.cta.label}
              </Link>
              <Link
                to={slide.ctaSecondary.path}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1a1a1a] px-7 py-3 text-sm font-bold text-[#1a1a1a] transition hover:bg-[#1a1a1a] hover:text-white active:scale-[0.98]"
              >
                {slide.ctaSecondary.label}
              </Link>
            </div>
          </div>

          {/* Right: image */}
          <div className="relative mx-auto w-full max-w-sm md:max-w-none">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white/50 shadow-2xl">
              <ImageWithFallback
                key={slide.image}
                src={slide.image}
                alt={slide.headline}
                className="h-full w-full object-cover transition duration-500"
                style={{ animation: 'fadeIn 0.6s ease forwards' }}
              />
            </div>

            {/* Float cards */}
            <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-bottom-6 sm:-left-6">
              <p className="text-sm font-black text-[#1a1a1a]">{slide.floatA.value}</p>
              <p className="mt-0.5 text-xs text-[#535766]">{slide.floatA.desc}</p>
            </div>

            <div className="absolute -right-4 top-10 rounded-2xl bg-white px-4 py-3 shadow-xl sm:-right-6">
              <p className="text-sm font-black text-[#1a1a1a]">{slide.floatB.value}</p>
              <p className="mt-0.5 text-xs text-[#535766]">{slide.floatB.desc}</p>
            </div>
          </div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] shadow-md backdrop-blur-sm transition hover:bg-white hover:shadow-lg sm:left-5 sm:h-11 sm:w-11"
        >
          <FiChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] shadow-md backdrop-blur-sm transition hover:bg-white hover:shadow-lg sm:right-5 sm:h-11 sm:w-11"
        >
          <FiChevronRight size={20} />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 bg-[#ff3f6c]'
                  : 'w-2 bg-[#ff3f6c]/30 hover:bg-[#ff3f6c]/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Promotional strip ────────────────────────────────────────────── */}
      <div className="border-y border-[#e9e9eb] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 divide-x divide-[#e9e9eb] md:grid-cols-4">
            {PROMO_ITEMS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-3 px-4 py-4 sm:px-6 sm:py-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff0f3]">
                  <Icon size={16} className="text-[#ff3f6c]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-[#1a1a1a] sm:text-[13px]">{title}</p>
                  <p className="truncate text-[11px] text-[#94969f] sm:text-[12px]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default HeroBanner
