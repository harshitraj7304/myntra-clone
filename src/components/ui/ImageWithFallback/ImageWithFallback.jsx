import { useState, useEffect } from 'react'
import Skeleton from '../Skeleton'

function ImageWithFallback({ src, alt, backupImages = [], className = '', ...props }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [attempt, setAttempt] = useState(0)

  // Filter valid sources
  const sources = [src, ...backupImages].filter(Boolean)

  // Reset states if src changes
  useEffect(() => {
    setLoading(true)
    setError(false)
    setCurrentSrc(src)
    setAttempt(0)
  }, [src])

  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleError = () => {
    // Attempt to load the next available backup image
    const nextAttempt = attempt + 1
    if (nextAttempt < sources.length) {
      setAttempt(nextAttempt)
      setCurrentSrc(sources[nextAttempt])
    } else {
      // All sources failed, trigger ultimate vector fallback
      setLoading(false)
      setError(true)
    }
  }

  // Set a 6-second timeout for the CURRENT source attempt
  useEffect(() => {
    if (!loading) return

    const timer = setTimeout(() => {
      handleError()
    }, 6000)

    return () => clearTimeout(timer)
  }, [currentSrc, loading, attempt])

  if (error || !currentSrc) {
    // Elegant fallback garment vector placeholder
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-100 p-6 text-slate-400 select-none ${className}`}>
        <svg
          className="h-16 w-16 opacity-40 animate-pulse text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904L9 21m3.813-5.096L13.5 21m-6-16.5L3.75 6v.75C3.75 12.016 7.6 16.5 12 16.5s8.25-4.484 8.25-9.75V6L16.5 4.5M12 3a2.25 2.25 0 00-2.25 2.25v.75H12v-.75A2.25 2.25 0 0012 3z"
          />
        </svg>
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-3.5">
          Fashion Product
        </span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Pulse Loader Overlay */}
      {loading && (
        <Skeleton className="absolute inset-0 z-10 w-full h-full rounded-none" />
      )}

      <img
        src={currentSrc}
        alt={alt || 'Fashion Product'}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        {...props}
      />
    </div>
  )
}

export default ImageWithFallback
