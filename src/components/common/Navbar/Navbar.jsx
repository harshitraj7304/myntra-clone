import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  FiSearch, FiHeart, FiShoppingBag, FiUser,
  FiMenu, FiX, FiChevronDown, FiShield, FiCreditCard, FiLogOut, FiTrendingUp, FiShoppingBag as FiBagIcon
} from 'react-icons/fi'
import useCart from '../../../hooks/useCart'
import useWishlist from '../../../hooks/useWishlist'
import { products } from '../../../data/products'

const NAV_LINKS = [
  { label: 'Men',    path: '/men' },
  { label: 'Women',  path: '/women' },
  { label: 'Kids',   path: '/kids' },
  { label: 'Beauty', path: '/beauty' },
  {
    label: 'Studio',
    path: '/studio',
    badge: 'NEW',
  },
]

const MEGA_MENUS = {
  Men: [
    { title: 'Topwear', items: ['T-Shirts', 'Casual Shirts', 'Formal Shirts', 'Sweatshirts', 'Jackets'] },
    { title: 'Bottomwear', items: ['Jeans', 'Casual Trousers', 'Formal Trousers', 'Shorts', 'Track Pants'] },
    { title: 'Footwear', items: ['Casual Shoes', 'Sports Shoes', 'Formal Shoes', 'Sneakers', 'Sandals'] },
    { title: 'More', items: ['Smart Wearables', 'Sunglasses', 'Wallets', 'Belts', 'Watches'] }
  ],
  Women: [
    { title: 'Indian & Fusion', items: ['Kurtas & Suits', 'Kurtis & Tunics', 'Sarees', 'Ethnic Wear', 'Leggings'] },
    { title: 'Western Wear', items: ['Dresses', 'Tops & Tees', 'Jeans & Trousers', 'Skirts', 'Co-ords'] },
    { title: 'Footwear', items: ['Flats & Heels', 'Casual Shoes', 'Sports Shoes', 'Boots', 'Slippers'] },
    { title: 'More', items: ['Beauty & Makeup', 'Handbags & Bags', 'Jewellery', 'Sunglasses', 'Watches'] }
  ],
  Kids: [
    { title: 'Boys Clothing', items: ['T-Shirts & Shirts', 'Jeans & Shorts', 'Trackpants', 'Ethnic Wear', 'Jackets'] },
    { title: 'Girls Clothing', items: ['Dresses & Frocks', 'Tops & Tees', 'Jeans & Leggings', 'Ethnic Wear', 'Shorts'] },
    { title: 'Footwear', items: ['Casual Shoes', 'Sports Shoes', 'Sandals', 'School Shoes', 'Flip Flops'] },
    { title: 'Infants', items: ['Bodysuits', 'Rompers', 'Clothing Sets', 'Winter Wear', 'Infant Care'] }
  ],
  Beauty: [
    { title: 'Makeup', items: ['Lipstick & Gloss', 'Mascara & Eyeliner', 'Foundation & Compact', 'Nail Polish', 'Makeup Kits'] },
    { title: 'Skincare', items: ['Face Serums', 'Moisturizers', 'Cleansers & Toners', 'Sunscreen', 'Face Masks'] },
    { title: 'Haircare', items: ['Shampoo & Conditioner', 'Hair Oils & Serums', 'Hair Colors', 'Hair Appliances', 'Hair Stylers'] },
    { title: 'Fragrances', items: ['Perfumes', 'Body Mists', 'Deodorants', 'Luxury Scents', 'Gift Sets'] }
  ]
}

const TRENDING_SEARCHES = ['Oversized Tees', 'Sneakers', 'Denim Jackets', 'Lipsticks', 'Kurta Sets', 'Polo Shirts']
const HOT_CATEGORIES = ['Men Casuals', 'Floral Dresses', 'Kids Wear', 'Face Serums', 'Watches']

/* ── Logo component ── */
function MyntraLogo() {
  const letters = [
    { char: 'M', color: '#ff3f6c' },
    { char: 'Y', color: '#ff905a' },
    { char: 'N', color: '#f2c210' },
    { char: 'T', color: '#03a685' },
    { char: 'R', color: '#03a9f4' },
    { char: 'A', color: '#ff3f6c' },
  ]
  return (
    <span className="flex items-center text-[22px] font-black tracking-tight select-none">
      {letters.map(({ char, color }) => (
        <span key={char + color} style={{ color }}>{char}</span>
      ))}
    </span>
  )
}

function Navbar() {
  const { cartCount } = useCart()
  const { wishlistItems } = useWishlist()
  
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const searchRef = useRef(null)
  const navigate  = useNavigate()

  /* Profile drawer states */
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true'
  })
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [showOtpScreen, setShowOtpScreen] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [suggestions, setSuggestions] = useState([])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([])
      return
    }
    const query = searchQuery.toLowerCase()
    
    // Filter matching products by name, brand or category
    const matched = products.filter(p => 
      p.brand.toLowerCase().includes(query) ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
    
    const uniqueSuggestions = []
    const seen = new Set()
    
    for (const p of matched) {
      const suggestionKey = `${p.brand} ${p.name}`
      if (!seen.has(suggestionKey)) {
        seen.add(suggestionKey)
        uniqueSuggestions.push(p)
      }
      if (uniqueSuggestions.length >= 5) break
    }
    
    setSuggestions(uniqueSuggestions)
  }, [searchQuery])

  const highlightText = (text, query) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="text-[#ff3f6c] font-black">{part}</span>
      ) : (
        part
      )
    )
  }

  /* Shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close mobile menu on resize to lg */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => { if (e.matches) setMobileOpen(false) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  /* Lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = (mobileOpen || profileOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, profileOpen])

  const handleSearchSubmit = (qString) => {
    const q = qString.trim()
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`)
      setSearchQuery('')
      setSearchFocused(false)
      setMobileOpen(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    handleSearchSubmit(searchQuery)
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    setLoginError('')
    if (phone.length < 10) {
      setLoginError('Enter a valid 10-digit mobile number')
      return
    }
    setShowOtpScreen(true)
  }

  const handleOtpVerify = (e) => {
    e.preventDefault()
    setLoginError('')
    if (otp.length < 4) {
      setLoginError('Enter a 4-digit code')
      return
    }
    setIsLoggedIn(true)
    localStorage.setItem('isLoggedIn', 'true')
    setShowOtpScreen(false)
    setPhone('')
    setOtp('')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    localStorage.removeItem('isLoggedIn')
    setProfileOpen(false)
  }

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow duration-200 ${
          scrolled ? 'shadow-[0_4px_16px_rgba(0,0,0,0.06)]' : 'shadow-[0_1px_0_0_#e9e9eb]'
        }`}
      >
        {/* ── Top bar ─────────────────────────────────────────────────── */}
        <div className="mx-auto flex h-[60px] max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">

          {/* Mobile: hamburger */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#1a1a1a] hover:bg-[#f5f5f6] lg:hidden transition-colors"
          >
            <FiMenu size={22} />
          </button>

          {/* Logo */}
          <Link to="/" aria-label="Myntra home" className="shrink-0 hover:opacity-90 transition-opacity mr-3">
            <MyntraLogo />
          </Link>

          {/* Desktop nav links with real Myntra Mega-Menu styling */}
          <nav className="hidden h-[60px] items-center gap-1.5 lg:flex mr-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const hasMega = MEGA_MENUS[link.label]
              return (
                <div key={link.path} className="group relative h-[60px] flex items-center">
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative flex h-[60px] items-center gap-1 px-3 text-[12px] font-black uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'text-[#ff3f6c]'
                          : 'text-[#1a1a1a] hover:text-[#ff3f6c]'
                      }`
                    }
                  >
                    {link.label}
                    {link.badge && (
                      <span className="rounded-full bg-[#ff3f6c] px-1.5 py-0.5 text-[8px] font-bold leading-none text-white absolute top-1 right-0 scale-90">
                        {link.badge}
                      </span>
                    )}
                    {/* Real Myntra rose bottom underline on active/hover */}
                    <span className="absolute bottom-0 left-0 h-[3px] rounded-t-full bg-[#ff3f6c] transition-all duration-200 w-0 group-hover:w-full" />
                  </NavLink>

                  {/* Mega Menu Grid */}
                  {hasMega && (
                    <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-1/2 -translate-x-1/2 top-[60px] w-[800px] bg-white border border-slate-200 shadow-2xl p-7 grid grid-cols-4 gap-6 rounded-b-xl z-50">
                      {hasMega.map((section) => (
                        <div key={section.title} className="space-y-3 text-left">
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-[#ff3f6c] border-b border-rose-50 pb-1.5">
                            {section.title}
                          </h4>
                          <ul className="space-y-1.5 text-xs font-semibold text-slate-500">
                            {section.items.map((item) => (
                              <li key={item}>
                                <button
                                  onClick={() => handleSearchSubmit(item)}
                                  className="hover:text-[#ff3f6c] hover:font-bold transition-colors cursor-pointer block text-left"
                                >
                                  {item}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Search bar — desktop with suggestions dropdown */}
          <div className="relative mx-3 hidden flex-1 min-w-0 max-w-[480px] md:block">
            <form
              onSubmit={handleSearch}
              className="relative flex items-center"
            >
              <FiSearch className="pointer-events-none absolute left-3.5 text-[#94969f]" size={16} />
              <input
                ref={searchRef}
                type="search"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="h-[38px] w-full rounded-sm border border-transparent bg-[#f5f5f6] pl-10 pr-9 text-[13px] text-[#1a1a1a] placeholder-[#94969f] outline-none transition focus:border-[#d4d5d9] focus:bg-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-[#94969f] hover:text-[#535766] transition-colors"
                  aria-label="Clear search"
                >
                  <FiX size={15} />
                </button>
              )}
            </form>

            {/* Trending & Suggestions Box */}
            {searchFocused && (
              <div className="absolute left-0 right-0 top-[44px] bg-white border border-slate-200 shadow-2xl rounded-xl p-5 z-50 text-left space-y-4 max-h-[420px] overflow-y-auto">
                {suggestions.length > 0 && (
                  <div className="space-y-2 border-b border-slate-100 pb-3">
                    <p className="text-[10px] font-black text-[#ff3f6c] uppercase tracking-widest">
                      Suggested Results
                    </p>
                    <ul className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                      {suggestions.map((p) => {
                        const fullName = `${p.brand} - ${p.name}`
                        return (
                          <li key={p.id}>
                            <button
                              onClick={() => handleSearchSubmit(fullName)}
                              className="w-full text-left py-2 hover:text-[#ff3f6c] hover:bg-rose-50/20 px-2 rounded transition flex items-center justify-between"
                            >
                              <span className="truncate max-w-[280px]">
                                {highlightText(fullName, searchQuery)}
                              </span>
                              <span className="text-[10px] font-black uppercase text-slate-400">
                                In {p.category}
                              </span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
                
                <div className="space-y-2.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FiTrendingUp className="text-[#ff3f6c]" /> Trending Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING_SEARCHES.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleSearchSubmit(tag)}
                        className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 hover:border-[#ff3f6c] hover:bg-rose-50 hover:text-[#ff3f6c] transition cursor-pointer"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Hot Categories
                  </p>
                  <ul className="divide-y divide-slate-50 text-xs font-bold text-slate-700">
                    {HOT_CATEGORIES.map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => handleSearchSubmit(cat)}
                          className="w-full text-left py-2 hover:text-[#ff3f6c] hover:bg-rose-50/20 px-2 rounded transition flex items-center justify-between"
                        >
                          <span>{cat}</span>
                          <span className="text-[10px] font-bold text-slate-400">Discover</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5 lg:ml-0">
            {/* Profile */}
            <button
              type="button"
              onClick={() => setProfileOpen(true)}
              className="group hidden sm:flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 transition-colors hover:bg-[#f5f5f6]"
            >
              <FiUser size={20} className={isLoggedIn ? 'text-[#ff3f6c]' : 'text-[#1a1a1a]'} />
              <span className="text-[11px] font-bold text-[#1a1a1a] truncate max-w-[65px]">
                {isLoggedIn ? 'Hi, Harsh' : 'Profile'}
              </span>
            </button>

            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `group hidden sm:flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 transition-colors hover:bg-[#f5f5f6] ${
                  isActive ? 'text-[#ff3f6c]' : 'text-[#1a1a1a]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <FiHeart
                      size={20}
                      className={`transition-transform group-hover:scale-110 ${isActive ? 'fill-[#ff3f6c] text-[#ff3f6c]' : ''}`}
                    />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff3f6c] text-[9px] font-bold text-white shadow-sm">
                        {wishlistItems.length}
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold">Wishlist</span>
                </>
              )}
            </NavLink>

            {/* Bag — with count badge */}
            <NavLink
              to="/bag"
              className={({ isActive }) =>
                `group relative flex flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 transition-colors hover:bg-[#f5f5f6] ${
                  isActive ? 'text-[#ff3f6c]' : 'text-[#1a1a1a]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <FiShoppingBag
                      size={20}
                      className={`transition-transform group-hover:scale-110 ${isActive ? 'text-[#ff3f6c]' : ''}`}
                    />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff3f6c] text-[9px] font-bold text-white shadow-sm">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-bold">Bag</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="border-t border-[#e9e9eb] px-4 pb-2.5 pt-2 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94969f]" size={15} />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, brands and more"
              className="h-[38px] w-full rounded-sm bg-[#f5f5f6] pl-10 pr-4 text-[13px] outline-none focus:bg-white transition-colors"
            />
          </form>
        </div>
      </header>

      {/* ── Mobile drawer backdrop ──────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ───────────────────────────────────────────────── */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        {/* Drawer header */}
        <div className="flex h-[60px] items-center justify-between border-b border-[#e9e9eb] px-5">
          <Link to="/" onClick={closeMobile}>
            <MyntraLogo />
          </Link>
          <button
            type="button"
            onClick={closeMobile}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#535766] hover:bg-[#f5f5f6] transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex flex-col py-2 overflow-y-auto flex-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-5 py-3.5 text-[14px] font-bold uppercase transition-colors ${
                  isActive
                    ? 'bg-[#fff0f3] text-[#ff3f6c]'
                    : 'text-[#1a1a1a] hover:bg-[#f5f5f6]'
                }`
              }
            >
              <span className="flex items-center gap-2">
                {link.label}
                {link.badge && (
                  <span className="rounded-full bg-[#ff3f6c] px-1.5 py-0.5 text-[9px] font-bold text-white">
                    {link.badge}
                  </span>
                )}
              </span>
              <FiChevronDown size={15} className="rotate-[-90deg] text-[#94969f]" />
            </NavLink>
          ))}
        </nav>

        {/* Drawer footer icons */}
        <div className="border-t border-[#e9e9eb] px-5 py-4 flex gap-4">
          <button
            onClick={() => {
              setMobileOpen(false)
              setProfileOpen(true)
            }}
            type="button"
            className="flex flex-1 flex-col items-center gap-1 rounded-lg py-2 hover:bg-[#f5f5f6] transition-colors"
          >
            <FiUser size={20} className={isLoggedIn ? 'text-[#ff3f6c]' : 'text-[#1a1a1a]'} />
            <span className="text-[11px] font-bold text-[#535766]">
              {isLoggedIn ? 'Harsh' : 'Profile'}
            </span>
          </button>
          <NavLink
            to="/wishlist"
            onClick={closeMobile}
            className="flex flex-1 flex-col items-center gap-1 rounded-lg py-2 hover:bg-[#f5f5f6] transition-colors"
          >
            <FiHeart size={20} className="text-[#1a1a1a]" />
            <span className="text-[11px] font-bold text-[#535766]">Wishlist</span>
          </NavLink>
          <NavLink
            to="/bag"
            onClick={closeMobile}
            className="relative flex flex-1 flex-col items-center gap-1 rounded-lg py-2 hover:bg-[#f5f5f6] transition-colors"
          >
            <span className="relative">
              <FiShoppingBag size={20} className="text-[#1a1a1a]" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff3f6c] text-[9px] font-bold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold text-[#535766]">Bag</span>
          </NavLink>
        </div>
      </div>

      {/* ── Profile Drawer (Slide over right panel) ─────────────────────── */}
      {profileOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-[3px] transition-opacity duration-300"
          onClick={() => setProfileOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-[110] flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          profileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Profile Console"
      >
        <div className="flex h-[60px] items-center justify-between border-b border-[#e9e9eb] px-5 bg-slate-50">
          <h3 className="text-sm font-bold uppercase text-slate-900 tracking-wider">Account Console</h3>
          <button
            onClick={() => setProfileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-200 transition"
          >
            <FiX size={18} className="text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-left">
          {isLoggedIn ? (
            /* Logged In screen */
            <div className="space-y-6">
              
              {/* Membership Card */}
              <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-5 text-white shadow-lg overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
                <span className="rounded-full bg-yellow-500/20 border border-yellow-500/50 px-2 py-0.5 text-[9px] font-bold text-yellow-400">
                  👑 MYNTRA GOLD MEMBER
                </span>
                <h4 className="mt-4 text-lg font-black tracking-wide">Harsh Kumar</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Member since May 2026</p>
                <div className="mt-5 border-t border-white/10 pt-4 flex justify-between text-xs font-semibold text-slate-300">
                  <span>Simulated ID</span>
                  <span className="font-black text-white">#MNT-98762</span>
                </div>
              </div>

              {/* Wallet Block */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-3 shadow-sm bg-slate-50">
                <div className="flex items-center gap-2.5 text-slate-800">
                  <FiCreditCard className="text-teal-600 text-lg" />
                  <span className="text-xs font-bold uppercase tracking-wider">Myntra Credit Wallet</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-slate-950">₹500.00</span>
                  <span className="text-[10px] text-teal-600 font-bold uppercase">Ready to Spend</span>
                </div>
              </div>

              {/* Options list */}
              <div className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                <Link to="/bag" onClick={() => setProfileOpen(false)} className="flex items-center justify-between py-3.5 hover:text-rose-600 transition">
                  <span>Shopping Bag ({cartCount} Items)</span>
                  <FiChevronDown className="-rotate-90 text-slate-400" />
                </Link>
                <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="flex items-center justify-between py-3.5 hover:text-rose-600 transition">
                  <span>My Saved Wishlist ({wishlistItems.length} Items)</span>
                  <FiChevronDown className="-rotate-90 text-slate-400" />
                </Link>
                <div className="flex items-center justify-between py-3.5 text-slate-400 cursor-not-allowed">
                  <span>Simulated Order History (4)</span>
                  <span className="text-[9px] bg-slate-100 rounded px-1 text-slate-500">MOCKED</span>
                </div>
                <div className="flex items-center gap-2 py-3.5 text-teal-600">
                  <FiShield /> <span>Verified Safe Credentials</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-rose-600 py-3 text-xs font-black uppercase tracking-wider text-[#ff3f6c] hover:bg-rose-50 transition active:scale-95"
              >
                <FiLogOut /> Logout Account
              </button>

            </div>
          ) : (
            /* Login Simulation Screen */
            <div className="space-y-6">
              
              <div className="space-y-1">
                <h4 className="text-base font-black text-slate-950">Welcome to Myntra Clone</h4>
                <p className="text-xs text-slate-500">Simulate quick signups via mock mobile authentication</p>
              </div>

              {showOtpScreen ? (
                /* OTP Verification Mock */
                <form onSubmit={handleOtpVerify} className="space-y-4">
                  <div className="rounded-lg bg-teal-50 border border-teal-200 p-3.5 text-xs text-teal-800 font-semibold leading-relaxed">
                    💬 Simulated SMS: Enter code <strong className="text-teal-950 font-black">1234</strong> to verify sign-in.
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Enter OTP Code</label>
                    <input
                      type="text"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit code"
                      className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm font-black tracking-widest text-center outline-none focus:border-rose-600"
                    />
                  </div>

                  {loginError && <p className="text-xs font-bold text-rose-600">{loginError}</p>}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowOtpScreen(false)}
                      className="flex-1 rounded-lg border border-slate-300 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 py-3 text-xs font-black uppercase tracking-wider text-white hover:shadow-lg transition active:scale-95 animate-pulse"
                    >
                      Verify code
                    </button>
                  </div>
                </form>
              ) : (
                /* Phone Submission Mock */
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Mobile Number</label>
                    <div className="flex rounded-lg border border-slate-200 overflow-hidden focus-within:border-rose-600 transition">
                      <span className="bg-slate-50 border-r border-slate-200 px-3 py-3 text-xs font-bold text-slate-500 flex items-center">+91</span>
                      <input
                        type="text"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit number"
                        className="w-full px-4 py-3 text-xs font-bold outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  {loginError && <p className="text-xs font-bold text-rose-600">{loginError}</p>}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md hover:shadow-lg transition active:scale-95"
                  >
                    Send OTP Verification
                  </button>

                  <p className="text-[10px] text-slate-400 text-center font-semibold leading-relaxed">
                    Secure 128-bit encryption mock. Your details are safe. By continuing, you consent to simulated signups.
                  </p>
                </form>
              )}

            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
