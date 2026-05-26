function Button({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`rounded bg-rose-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-rose-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
