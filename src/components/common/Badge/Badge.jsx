function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-200 text-slate-950',
    sale: 'bg-rose-600 text-white',
    new: 'bg-blue-600 text-white',
    popular: 'bg-orange-500 text-white',
  }

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${variants[variant]}`}
    >
      {children}
    </span>
  )
}

export default Badge
