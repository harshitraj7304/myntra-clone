import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiZap } from 'react-icons/fi'
import ImageWithFallback from '../ui/ImageWithFallback'

function DealsSection({ deals }) {
  const [timers, setTimers] = useState({})

  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        const updated = { ...prev }
        deals.forEach((deal) => {
          updated[deal.id] = prev[deal.id] ? prev[deal.id] - 1 : deal.expiresIn
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [deals])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${mins}m ${secs}s`
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FiZap className="text-2xl text-orange-500 fill-orange-500 animate-bounce" />
            <h2 className="text-3xl font-black text-slate-950">Flash Deals</h2>
          </div>
          <p className="text-slate-600">
            Limited time offers on selected items
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {deals.map((deal) => (
          <Link
            key={deal.id}
            to={deal.link}
            className="group overflow-hidden rounded-xl shadow-md transition duration-300 hover:shadow-xl"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-100">
              <ImageWithFallback
                src={deal.image}
                alt={deal.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Discount Badge */}
              <div className="absolute right-3 top-3 flex h-14 w-14 items-center justify-center rounded-full bg-rose-600">
                <div className="text-center">
                  <p className="text-xs font-bold text-white">
                    {deal.discount}%
                  </p>
                  <p className="text-xs font-bold text-white">OFF</p>
                </div>
              </div>

              {/* Timer Badge */}
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 px-3 py-2 backdrop-blur">
                <p className="text-xs font-bold text-rose-400">
                  {formatTime(timers[deal.id] || deal.expiresIn)}
                </p>
              </div>
            </div>

            <div className="space-y-2 bg-white p-4">
              <h3 className="line-clamp-1 font-bold text-slate-950">
                {deal.title}
              </h3>
              <p className="line-clamp-2 text-sm text-slate-600">
                {deal.description}
              </p>
              <button className="mt-3 w-full rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 py-2 text-sm font-bold text-white transition hover:shadow-md">
                Shop Now
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default DealsSection
