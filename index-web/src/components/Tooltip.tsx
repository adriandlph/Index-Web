import type { ReactNode } from 'react'

type TooltipProps = {
  children: ReactNode
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const positionStyles: Record<string, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

function Tooltip({ children, text, position = 'top' }: TooltipProps) {
  return (
    <div className="group relative">
      {children}
      <div className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-gray-700 px-2 py-1 text-xs text-gray-200 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 ${positionStyles[position]}`}>
        {text}
      </div>
    </div>
  )
}

export default Tooltip
