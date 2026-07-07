import { useState, useRef, useEffect } from 'react'

type TimePickerProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

function TimePicker({ value, onChange, placeholder }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [selHour, setSelHour] = useState(value ? value.split(':')[0] : '')
  const [selMin, setSelMin] = useState(value ? value.split(':')[1] : '')

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const hoursRef = useRef<HTMLDivElement>(null)
  const minsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const idx = HOURS.indexOf(selHour || '12')
    if (idx >= 0 && hoursRef.current) {
      const child = hoursRef.current.children[idx] as HTMLElement
      if (child) child.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }, [open, selHour])

  useEffect(() => {
    if (!open) return
    const idx = MINUTES.indexOf(selMin || '00')
    if (idx >= 0 && minsRef.current) {
      const child = minsRef.current.children[idx] as HTMLElement
      if (child) child.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }, [open, selMin])

  function selectHour(h: string) {
    setSelHour(h)
    const m = selMin || '00'
    onChange(`${h}:${m}`)
  }

  function selectMin(m: string) {
    setSelMin(m)
    const h = selHour || '00'
    onChange(`${h}:${m}`)
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <input
          type="text"
          readOnly
          value={value || ''}
          placeholder={placeholder || 'HH:MM'}
          className="w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-800 pl-10 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
        />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-56 rounded-xl border border-gray-700 bg-gray-800 p-3 shadow-2xl">
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 text-center mb-1.5">Hour</div>
              <div
                ref={hoursRef}
                className="max-h-44 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {HOURS.map((h) => (
                  <button
                    key={h}
                    onClick={() => selectHour(h)}
                    className={`w-full rounded-lg px-2 py-1.5 text-sm text-center transition-colors ${
                      h === selHour
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center pt-5 text-sm text-gray-400 font-semibold">:</div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 text-center mb-1.5">Min</div>
              <div
                ref={minsRef}
                className="max-h-44 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                {MINUTES.map((m) => (
                  <button
                    key={m}
                    onClick={() => selectMin(m)}
                    className={`w-full rounded-lg px-2 py-1.5 text-sm text-center transition-colors ${
                      m === selMin
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimePicker
