import { useEffect, useState } from 'react'
import Tooltip from './Tooltip.tsx'

type NotificationProps = {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}

function Notification({ message, type = 'success', onClose }: NotificationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const bg = type === 'success' ? 'bg-emerald-500/90' : 'bg-red-500/90'

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border border-white/10 px-5 py-3 shadow-2xl backdrop-blur-md transition-all duration-300 ${
        bg
      } ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <span className="text-sm font-medium text-white">{message}</span>
      <Tooltip text="Close">
        <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="ml-2 text-white/60 hover:text-white">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </Tooltip>
    </div>
  )
}

export default Notification
