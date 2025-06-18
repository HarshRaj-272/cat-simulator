export function Button({ children, onClick, className = '', variant = 'default', size = 'md' }) {
  const base = 'rounded px-4 py-2 font-medium transition-all';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-400 text-gray-800 hover:bg-gray-100',
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
