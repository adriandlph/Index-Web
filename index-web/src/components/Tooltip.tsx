import type { ReactNode } from 'react'

type TooltipProps = {
  children: ReactNode
  text: string
}

function Tooltip({ children, text }: TooltipProps) {
  return (
    <div className="group relative">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
        {text}
      </div>
    </div>
  )
}

export default Tooltip
