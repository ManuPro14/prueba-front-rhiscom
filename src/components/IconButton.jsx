const variants = {
  primary:
    'border-blue-600 bg-blue-600 text-white hover:border-blue-700 hover:bg-blue-700',
  neutral:
    'border-slate-300 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  edit: 'border-slate-200 bg-white text-blue-600 hover:border-blue-200 hover:bg-blue-50',
  danger:
    'border-slate-200 bg-white text-red-600 hover:border-red-200 hover:bg-red-50',
  dangerSolid:
    'border-red-600 bg-red-600 text-white hover:border-red-700 hover:bg-red-700',
}

const sizes = {
  sm: 'size-8 rounded-md',
  md: 'size-10 rounded-lg',
}

export default function IconButton({
  label,
  tooltip = label,
  variant = 'neutral',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`group relative inline-grid shrink-0 cursor-pointer place-items-center border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      aria-label={label}
      {...props}
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-[calc(100%+7px)] left-1/2 z-30 -translate-x-1/2 translate-y-0.5 whitespace-nowrap rounded bg-slate-800 px-2 py-1 text-[10px] font-medium leading-none text-white opacity-0 shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
      >
        {tooltip}
      </span>
    </button>
  )
}

