import { useState } from 'react'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption } from '@headlessui/react'

type FilterSelectProps = {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {
  const [query, setQuery] = useState('')

  const filtered = ((query === '')
    ? options
    : options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
  ).slice(0, 5)

  return (
    <label className="flex items-center gap-2 text-sm text-gray-400">
      <span className="whitespace-nowrap">{label}:</span>
      <Combobox value={value} onChange={(v) => { onChange(v ?? ''); setQuery('') }}>
        <div className="relative">
          <ComboboxInput
            displayValue={(id: string) => options.find((o) => o.value === id)?.label ?? ''}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="..."
            className="w-48 rounded-lg border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
          />
          <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-700 bg-gray-800 py-1 text-sm shadow-xl">
            {filtered.map((o) => (
              <ComboboxOption
                key={o.value}
                value={o.value}
                className="cursor-pointer px-3 py-1.5 text-gray-300 transition-colors data-[focus]:bg-gray-700 data-[selected]:text-indigo-400"
              >
                {o.label}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
    </label>
  )
}

export default FilterSelect
