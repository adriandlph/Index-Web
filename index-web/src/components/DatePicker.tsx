import { useState, useRef, useEffect } from 'react'

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selectedDate = value ? new Date(value + 'T00:00:00') : null
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const [viewDate, setViewDate] = useState(selectedDate || today)

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

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const days: (number | null)[] = []
  for (let i = 0; i < startOffset; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  function isSelected(day: number) {
    if (!selectedDate) return false
    return selectedDate.getFullYear() === year &&
           selectedDate.getMonth() === month &&
           selectedDate.getDate() === day
  }

  function isToday(day: number) {
    const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return d === todayStr
  }

  function selectDay(day: number) {
    const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(d)
    setOpen(false)
  }

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }

  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  const displayValue = value
    ? `${String(selectedDate!.getDate()).padStart(2, '0')}-${String(selectedDate!.getMonth() + 1).padStart(2, '0')}-${selectedDate!.getFullYear()}`
    : ''

  return (
    <div ref={ref} className="relative">
      <div className="relative cursor-pointer" onClick={() => setOpen(!open)}>
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <input
          type="text"
          readOnly
          value={displayValue}
          placeholder={placeholder || 'DD-MM-YYYY'}
          className="w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-800 pl-10 pr-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
        />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-72 rounded-xl border border-gray-700 bg-gray-800 p-3 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm font-semibold text-gray-200">{MONTHS[month]} {year}</span>
            <button
              onClick={nextMonth}
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1.5">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-xs font-medium text-gray-500 text-center">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <button
                key={i}
                onClick={() => day && selectDay(day)}
                disabled={!day}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm transition-colors ${
                  !day ? 'cursor-default' : 'cursor-pointer hover:bg-gray-700'
                } ${
                  day && isSelected(day)
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : day && isToday(day)
                      ? 'text-indigo-400 font-semibold'
                      : 'text-gray-300'
                }`}
              >
                {day || ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
