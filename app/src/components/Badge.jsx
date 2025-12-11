function Badge({ children, variant = 'primary', className = '' }) {
  const variants = {
    primary: 'bg-indigo-600 text-white',
    success: 'bg-green-500 text-white',
    danger: 'bg-red-500 text-white',
    warning: 'bg-yellow-500 text-white',
    secondary: 'bg-gray-500 text-white',
  }
  
  return (
    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge

