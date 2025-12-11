function Textarea({ 
  label, 
  id, 
  value, 
  onChange, 
  placeholder = '', 
  rows = 3,
  required = false,
  className = '',
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${className}`}
        {...props}
      />
    </div>
  )
}

export default Textarea

