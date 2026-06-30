export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-lavender-300 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-gradient-to-r from-lavender-600 to-lavender-500 text-white shadow-md hover:shadow-lavender-300 hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-white text-lavender-700 border-2 border-lavender-300 hover:bg-lavender-50 hover:scale-[1.02]',
    outline:
      'border-2 border-slate-900 bg-transparent text-slate-900 hover:bg-slate-900 hover:text-white hover:scale-[1.02] active:scale-[0.98]',
    dark:
      'bg-gray-950 text-white hover:bg-lavender-700 hover:scale-[1.02] active:scale-[0.98]',
    ghost:
      'text-lavender-600 hover:bg-lavender-50 hover:scale-[1.02]',
    danger:
      'bg-rose-500 text-white hover:bg-rose-600 hover:scale-[1.02]',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-9 py-4 text-lg',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
