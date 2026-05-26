import { useState, useRef, useEffect } from 'react'
import { BiChevronDown } from 'react-icons/bi'

function SortDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Best Rating' },
    { value: 'discount', label: 'Highest Discount' },
  ]

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLabel =
    sortOptions.find((opt) => opt.value === value)?.label || 'Sort By'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:border-slate-300"
      >
        {currentLabel}
        <BiChevronDown
          className={`transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`block w-full px-4 py-3 text-left text-sm transition ${
                value === option.value
                  ? 'bg-rose-50 font-semibold text-rose-600'
                  : 'text-slate-950 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SortDropdown
