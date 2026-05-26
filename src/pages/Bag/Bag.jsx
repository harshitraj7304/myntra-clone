import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiHeart, FiTag, FiShoppingBag, FiMapPin, FiCheckCircle, FiChevronRight } from 'react-icons/fi'
import useCart from '../../hooks/useCart'
import useWishlist from '../../hooks/useWishlist'
import useDocumentTitle from '../../hooks/useDocumentTitle'
import ImageWithFallback from '../../components/ui/ImageWithFallback'

const VALID_COUPONS = {
  MYNTRA10: { type: 'percent', value: 10, description: '10% OFF on all order values' },
  FREESHIP: { type: 'shipping', value: 0, description: 'Convenience fee completely WAIVED' },
  FASHION20: { type: 'percent', value: 20, description: 'Special 20% OFF coupon' }
}

function Bag() {
  useDocumentTitle('Shopping Bag — Myntra')
  const navigate = useNavigate()
  
  const {
    cartItems,
    cartTotal,
    cartCount,
    removeItem,
    updateQuantity,
    clearCart
  } = useCart()

  const { addToWishlist } = useWishlist()

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [address, setAddress] = useState({
    name: 'Harsh Kumar',
    phone: '9876543210',
    street: '123 Fashion Ave, Sector 15',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001'
  })
  
  // Checkout flow states
  const [paymentMode, setPaymentMode] = useState('upi')
  const [isProcessingOrder, setIsProcessingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  // Advanced checkout inputs & state validation
  const [upiId, setUpiId] = useState('')
  const [upiTimer, setUpiTimer] = useState(300)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [paymentError, setPaymentError] = useState('')

  // UPI countdown timer
  useEffect(() => {
    if (!showCheckoutModal || paymentMode !== 'upi' || orderPlaced) return

    setUpiTimer(300)
    const interval = setInterval(() => {
      setUpiTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setPaymentError('UPI session expired. Please switch payment modes and retry!')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showCheckoutModal, paymentMode, orderPlaced])

  const formatUpiTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCardNumberChange = (val) => {
    const numbersOnly = val.replace(/\D/g, '').slice(0, 16)
    const formatted = numbersOnly.match(/.{1,4}/g)?.join(' ') || numbersOnly
    setCardNumber(formatted)
    setPaymentError('')
  }

  const handleCardExpiryChange = (val) => {
    const clean = val.replace(/\D/g, '').slice(0, 4)
    if (clean.length >= 2) {
      setCardExpiry(`${clean.slice(0, 2)}/${clean.slice(2, 4)}`)
    } else {
      setCardExpiry(clean)
    }
    setPaymentError('')
  }

  const handleCardCvvChange = (val) => {
    setCardCvv(val.replace(/\D/g, '').slice(0, 3))
    setPaymentError('')
  }

  const getCardBrand = (num) => {
    const cleanNum = num.replace(/\s/g, '')
    if (cleanNum.startsWith('4')) return { name: 'Visa', color: 'bg-blue-600', text: 'text-white' }
    if (cleanNum.startsWith('5')) return { name: 'Mastercard', color: 'bg-amber-600', text: 'text-white' }
    if (cleanNum.startsWith('6')) return { name: 'RuPay', color: 'bg-sky-600', text: 'text-white' }
    return { name: 'Credit Card', color: 'bg-slate-700', text: 'text-slate-200' }
  }

  // Calculations
  const rawSubtotal = cartTotal
  const convenienceFee = appliedCoupon?.type === 'shipping' ? 0 : rawSubtotal > 0 ? 99 : 0
  const shippingFee = rawSubtotal > 500 || rawSubtotal === 0 ? 0 : 49
  
  let couponDiscount = 0
  if (appliedCoupon?.type === 'percent') {
    couponDiscount = Math.round((rawSubtotal * appliedCoupon.value) / 100)
  }

  const finalTotal = rawSubtotal - couponDiscount + convenienceFee + shippingFee

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    setCouponError('')
    const code = couponCode.trim().toUpperCase()
    
    if (VALID_COUPONS[code]) {
      setAppliedCoupon({ code, ...VALID_COUPONS[code] })
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code. Try MYNTRA10 or FASHION20!')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
  }

  const handleMoveToWishlist = (item) => {
    addToWishlist(item.id)
    removeItem(item.key)
  }

  const handlePlaceOrder = () => {
    setShowCheckoutModal(true)
  }

  const handleSimulatePayment = () => {
    setPaymentError('')
    
    // Address validation
    if (!address.name.trim() || !address.phone.trim() || !address.street.trim() || !address.city.trim() || !address.pincode.trim()) {
      setPaymentError('Please fill in complete delivery address details!')
      return
    }

    if (paymentMode === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        setPaymentError('Please enter a valid UPI ID (e.g., username@okaxis)')
        return
      }
      if (upiTimer === 0) {
        setPaymentError('UPI session expired. Please switch payment modes and retry!')
        return
      }
    } else if (paymentMode === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setPaymentError('Please enter a valid 16-digit card number!')
        return
      }
      if (cardExpiry.length < 5) {
        setPaymentError('Please enter card expiry in MM/YY format!')
        return
      }
      if (cardCvv.length < 3) {
        setPaymentError('Please enter a valid 3-digit CVV number!')
        return
      }
      if (!cardHolder.trim()) {
        setPaymentError('Please enter the Cardholder\'s Name!')
        return
      }
    }

    setIsProcessingOrder(true)
    setTimeout(() => {
      setIsProcessingOrder(false)
      setOrderPlaced(true)
    }, 2000)
  }

  const handleOrderSuccessClose = () => {
    clearCart()
    setShowCheckoutModal(false)
    setOrderPlaced(false)
    navigate('/')
  }

  return (
    <div className="bg-[#f5f5f6] min-h-screen py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Progress Tracker Stepper */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8 select-none">
          <span className="text-rose-600">BAG</span>
          <FiChevronRight />
          <span className={showCheckoutModal ? 'text-rose-600' : ''}>DELIVERY & PAYMENT</span>
          <FiChevronRight />
          <span className={orderPlaced ? 'text-rose-600' : ''}>ORDER CONFIRMED</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm max-w-md mx-auto space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f3]">
              <FiShoppingBag className="text-4xl text-[#ff3f6c]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-950">Your bag is empty!</h2>
              <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                There is nothing in your shopping bag. Let&apos;s add some beautiful trending clothes and accessories!
              </p>
            </div>
            <Link
              to="/men"
              className="inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12 items-start">
            
            {/* Left: Cart Items List */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Address Strip */}
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-rose-600 text-lg mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-slate-800">
                      Deliver to: <span className="font-black text-slate-950">{address.name}, {address.pincode}</span>
                    </p>
                    <p className="text-slate-500 mt-0.5 line-clamp-1">
                      {address.street}, {address.city}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="rounded border border-[#ff3f6c] px-3 py-1.5 text-[10px] font-bold text-[#ff3f6c] hover:bg-[#fff0f3] transition uppercase"
                >
                  Change
                </button>
              </div>

              {/* Items Card List */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3">
                  Items in Bag ({cartCount})
                </h3>

                <div className="divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.key} className="flex gap-4 py-4 first:pt-0 last:pb-0 transition duration-300 hover:bg-slate-50/50 p-2 rounded-lg">
                      
                      {/* Thumbnail */}
                      <div className="h-24 w-18 shrink-0 overflow-hidden rounded bg-slate-100">
                        <ImageWithFallback
                          src={item.image}
                          backupImages={item.backupImages}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Detail Column */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide">{item.brand}</h4>
                              <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{item.name}</p>
                            </div>
                            <span className="text-xs font-black text-slate-950">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>

                          {/* Size and Qty Selectors */}
                          <div className="mt-2.5 flex flex-wrap gap-3">
                            {item.selectedSize && (
                              <div className="rounded bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-700">
                                Size: <span className="font-black text-slate-950">{item.selectedSize}</span>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              <span>Qty:</span>
                              <select
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.key, parseInt(e.target.value))}
                                className="bg-transparent font-black text-slate-950 outline-none cursor-pointer"
                              >
                                {[1, 2, 3, 4, 5].map((q) => (
                                  <option key={q} value={q}>{q}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Actions buttons */}
                        <div className="mt-3.5 flex gap-4 text-xs font-bold text-slate-500 border-t border-slate-50 pt-2.5">
                          <button
                            onClick={() => removeItem(item.key)}
                            className="flex items-center gap-1 hover:text-rose-600 transition"
                          >
                            <FiTrash2 /> Remove
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            onClick={() => handleMoveToWishlist(item)}
                            className="flex items-center gap-1 hover:text-rose-600 transition"
                          >
                            <FiHeart /> Save to Wishlist
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right: Coupon & Price Details */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Coupons Module */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <FiTag className="text-rose-600 text-lg" />
                  <h3 className="text-sm font-black uppercase tracking-wider">Apply Coupons</h3>
                </div>

                {appliedCoupon ? (
                  <div className="rounded-lg bg-teal-50 border border-teal-200 p-3.5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-teal-800 tracking-wide uppercase">
                        ✅ CODE Applied: {appliedCoupon.code}
                      </p>
                      <p className="text-[11px] text-teal-700 mt-0.5">{appliedCoupon.description}</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-bold text-rose-600 hover:underline uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleApplyCoupon} className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="E.g. MYNTRA10 or FASHION20"
                          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold tracking-wide outline-none transition focus:border-rose-600 focus:bg-white"
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-slate-900 px-4 text-xs font-bold text-white hover:bg-slate-800 transition"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] font-bold text-rose-600">{couponError}</p>}
                    </form>

                    <div className="space-y-2 pt-3.5 border-t border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Available Coupons
                      </p>
                      <div className="flex flex-col gap-2">
                        {Object.entries(VALID_COUPONS).map(([code, c]) => (
                          <button
                            key={code}
                            onClick={() => setAppliedCoupon({ code, ...c })}
                            className="flex items-center justify-between border border-slate-200 hover:border-rose-600 hover:bg-rose-50/5 p-3 rounded-lg text-left transition active:scale-[0.98]"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="rounded bg-rose-50 border border-rose-100 text-[#ff3f6c] px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                                  {code}
                                </span>
                                <span className="text-[10px] font-black text-slate-800">
                                  {c.type === 'percent' ? `${c.value}% OFF` : 'Free Shipping'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium mt-1">
                                {c.description}
                              </p>
                            </div>
                            <span className="text-[10px] font-black text-rose-600 uppercase hover:underline">
                              Apply
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Price Details Module */}
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-950 tracking-wider border-b border-slate-100 pb-3">
                  Price Details ({cartCount} Items)
                </h3>

                <div className="space-y-3.5 text-xs font-bold text-slate-600">
                  <div className="flex justify-between">
                    <span>Total MRP</span>
                    <span className="text-slate-800">₹{rawSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-teal-600">
                      <span>Coupon Discount</span>
                      <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Convenience Fee</span>
                    <span className={convenienceFee === 0 ? 'text-teal-600' : 'text-slate-800'}>
                      {convenienceFee === 0 ? 'FREE' : `₹${convenienceFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping Charge</span>
                    <span className={shippingFee === 0 ? 'text-teal-600' : 'text-slate-800'}>
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>

                  <hr className="border-slate-100" />

                  <div className="flex justify-between text-sm font-black text-slate-950 pt-1">
                    <span>Total Amount</span>
                    <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-md hover:shadow-lg transition active:scale-[0.98]"
                >
                  Place Order
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Checkout Modal / Drawer Overlay */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl overflow-hidden">
            
            {orderPlaced ? (
              // Order success screen
              <div className="text-center py-8 space-y-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 border-4 border-teal-500 text-teal-500 animate-pulse">
                  <FiCheckCircle size={45} className="fill-teal-500 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-950">Order Placed Successfully!</h3>
                  <p className="text-sm text-slate-500 px-4 leading-relaxed">
                    Hurrah! Your simulated payment was received. We have reserved your items and dispatched them to the delivery team.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 text-xs text-left max-w-xs mx-auto border border-slate-100 font-semibold space-y-1.5">
                  <p><strong className="text-slate-800">Ship to:</strong> {address.name}</p>
                  <p><strong className="text-slate-800">Address:</strong> {address.street}, {address.city}</p>
                  <p><strong className="text-slate-800">Payment Mode:</strong> {paymentMode.toUpperCase()}</p>
                  <p><strong className="text-slate-800">Transaction ID:</strong> MNT{Math.floor(Math.random()*9000000)+1000000}</p>
                </div>

                <button
                  onClick={handleOrderSuccessClose}
                  className="w-full rounded-lg bg-slate-900 py-3 text-sm font-bold text-white hover:bg-slate-800 transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              // Delivery details and payment Mode Selector
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-black text-slate-950">Delivery & Payment details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Please confirm details to proceed simulation.</p>
                </div>

                {/* Delivery Form */}
                <div className="space-y-3.5">
                  <p className="text-xs font-black uppercase text-slate-700 tracking-wider">Confirm Address</p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      placeholder="Receiver's Name"
                      className="rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600"
                    />
                    <input
                      type="text"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="Mobile Phone"
                      className="rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600"
                    />
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="Address details"
                      className="col-span-2 rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600"
                    />
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                      className="rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600"
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                      placeholder="Pincode"
                      className="rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-3">
                  <p className="text-xs font-black uppercase text-slate-700 tracking-wider">Choose Payment Mode</p>
                  <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                    {[
                      { id: 'upi', label: 'UPI / GooglePay' },
                      { id: 'card', label: 'Credit/Debit Card' },
                      { id: 'cod', label: 'Cash on Delivery' },
                      { id: 'net', label: 'Net Banking' }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setPaymentMode(mode.id)}
                        className={`rounded-lg border-2 p-3 text-center transition ${
                          paymentMode === mode.id
                            ? 'border-rose-600 bg-rose-50 text-[#ff3f6c]'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {mode.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Payment Error Banner */}
                {paymentError && (
                  <div className="rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs font-bold text-rose-600 animate-shake">
                    ⚠️ {paymentError}
                  </div>
                )}

                {/* UPI details details panel */}
                {paymentMode === 'upi' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wide">UPI Instant Checkout</p>
                      <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md text-white ${upiTimer < 60 ? 'bg-rose-500 animate-pulse' : 'bg-slate-800'}`}>
                        ⏳ {formatUpiTimer(upiTimer)}
                      </span>
                    </div>

                    <div className="flex justify-center bg-white p-3 rounded-lg border border-slate-100 shadow-sm max-w-[120px] mx-auto">
                      <svg className="w-20 h-20 text-slate-800 opacity-90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="5" width="25" height="25" rx="2" strokeWidth="4" />
                        <rect x="12.5" y="12.5" width="10" height="10" rx="1" fill="currentColor" />
                        <rect x="70" y="5" width="25" height="25" rx="2" strokeWidth="4" />
                        <rect x="77.5" y="12.5" width="10" height="10" rx="1" fill="currentColor" />
                        <rect x="5" y="70" width="25" height="25" rx="2" strokeWidth="4" />
                        <rect x="12.5" y="77.5" width="10" height="10" rx="1" fill="currentColor" />
                        <path d="M45 5h15M45 15h10M45 25h20M5 45h20M5 55h15M70 45h25M70 55h20M45 45h10M55 55h15M45 70v15M55 80h10M80 70h15M80 80h10M90 90h5" strokeLinecap="round" />
                      </svg>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400">Virtual UPI Address</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => { setUpiId(e.target.value); setPaymentError(''); }}
                        placeholder="Enter UPI ID (e.g., username@okaxis)"
                        className="w-full rounded border border-slate-200 px-3 py-2 text-xs font-bold outline-none focus:border-rose-600 bg-white"
                      />
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                        Scan QR code with BHIM, GooglePay, PhonePe, or pay via registered VPA instantly.
                      </p>
                    </div>
                  </div>
                )}

                {/* Credit/Debit Card Details details panel */}
                {paymentMode === 'card' && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 text-left">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Enter Card Details</p>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded text-white ${getCardBrand(cardNumber).color}`}>
                        {getCardBrand(cardNumber).name}
                      </span>
                    </div>

                    {/* Virtual Card Layout preview */}
                    <div className={`rounded-xl p-4 text-white shadow-md flex flex-col justify-between h-32 relative overflow-hidden transition-colors duration-500 bg-gradient-to-br ${
                      cardNumber.startsWith('4') ? 'from-blue-600 to-indigo-800' :
                      cardNumber.startsWith('5') ? 'from-amber-600 to-orange-800' :
                      cardNumber.startsWith('6') ? 'from-sky-600 to-blue-800' :
                      'from-slate-700 to-slate-900'
                    }`}>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-black italic tracking-wider">MYNTRA CARD</span>
                        <span className="text-[10px] font-black tracking-widest">{getCardBrand(cardNumber).name.toUpperCase()}</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black tracking-[0.2em] font-mono truncate">{cardNumber || '•••• •••• •••• ••••'}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] text-slate-300 font-bold uppercase">Cardholder</p>
                            <p className="text-[10px] font-black tracking-wide uppercase truncate max-w-[140px]">{cardHolder || 'NAME SURNAME'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] text-slate-300 font-bold uppercase">Expires</p>
                            <p className="text-[10px] font-black tracking-wide font-mono">{cardExpiry || 'MM/YY'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <div className="col-span-3 space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => handleCardNumberChange(e.target.value)}
                          placeholder="4111 2222 3333 4444"
                          className="w-full rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600 bg-white"
                        />
                      </div>

                      <div className="col-span-2 space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => handleCardExpiryChange(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600 bg-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">CVV</label>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvv}
                          onChange={(e) => handleCardCvvChange(e.target.value)}
                          placeholder="***"
                          className="w-full rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600 bg-white"
                        />
                      </div>

                      <div className="col-span-3 space-y-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Cardholder's Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => { setCardHolder(e.target.value); setPaymentError(''); }}
                          placeholder="Full Name as printed on Card"
                          className="w-full rounded border border-slate-200 px-3 py-2 font-bold outline-none focus:border-rose-600 bg-white uppercase"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Action Drawer controls */}
                <div className="flex gap-3 pt-3">
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 rounded-lg border border-slate-300 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessingOrder}
                    className="flex-[2] rounded-lg bg-slate-950 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-slate-800 transition disabled:opacity-50"
                  >
                    {isProcessingOrder ? 'Processing Payment...' : `Confirm & Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

export default Bag
