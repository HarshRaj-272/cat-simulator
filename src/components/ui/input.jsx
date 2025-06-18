export function Input({ type = 'text', className = '', ...props }) {
  return (
    <input
      type={type}
      className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring focus:ring-blue-300 ${className}`}
      {...props}
    />
  );
}
