function Card({ children, className = '', header, footer }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {header && (
        <div className="bg-indigo-600 text-white px-4 py-3">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-3 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card

