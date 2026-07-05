import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, Dialog, DialogBackdrop, DialogPanel, DialogTitle, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import Tooltip from './Tooltip.tsx'

type Field = {
  key: string
  label: string
  value: string
  options?: { value: string; label: string }[]
  searchable?: boolean
}

type EditModalProps = {
  title: string
  fields: Field[]
  onSave: (values: Record<string, string>) => void
  onClose: () => void
}

function EditModal({ title, fields, onSave, onClose }: EditModalProps) {
  const { t } = useTranslation()
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {}
    for (const f of fields) {
      initial[f.key] = f.value || (f.options?.[0]?.value ?? '')
    }
    return initial
  })
  const [searchQuery, setSearchQuery] = useState<Record<string, string>>({})

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
          <DialogTitle className="text-xl font-semibold text-white mb-4">{title}</DialogTitle>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
                {f.options && f.searchable ? (
                  <Combobox value={values[f.key]} onChange={(v) => { setValues({ ...values, [f.key]: v ?? '' }); setSearchQuery({ ...searchQuery, [f.key]: '' }) }}>
                    <div className="relative">
                      <ComboboxInput
                        displayValue={(id: string | null) => f.options?.find((o) => o.value === id)?.label ?? ''}
                        onChange={(e) => setSearchQuery({ ...searchQuery, [f.key]: e.target.value })}
                        className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none"
                        placeholder="..."
                      />
                      <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-700 bg-gray-800 py-1 text-sm shadow-xl">
                        {((searchQuery[f.key] ?? '') === ''
                          ? f.options
                          : f.options.filter((o) =>
                              o.label.toLowerCase().includes((searchQuery[f.key] ?? '').toLowerCase())
                            )
                        ).slice(0, 5).map((o) => (
                          <ComboboxOption
                            key={o.value}
                            value={o.value}
                            className="cursor-pointer px-3 py-2 text-gray-300 transition-colors data-[focus]:bg-gray-700 data-[selected]:text-indigo-400"
                          >
                            {o.label}
                          </ComboboxOption>
                        ))}
                      </ComboboxOptions>
                    </div>
                  </Combobox>
                ) : f.options ? (
                  <Listbox
                    value={values[f.key]}
                    onChange={(v) => setValues({ ...values, [f.key]: v })}
                  >
                    <ListboxButton className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-gray-700">
                      <span>{f.options.find((o) => o.value === values[f.key])?.label}</span>
                      <svg className="h-4 w-4 shrink-0 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </ListboxButton>
                    <ListboxOptions className="z-50 mt-1 rounded-lg border border-gray-700 bg-gray-800 py-1 text-sm shadow-xl" anchor="bottom">
                      {f.options.map((o) => (
                        <ListboxOption
                          key={o.value}
                          value={o.value}
                          className="cursor-pointer px-3 py-2 text-gray-300 transition-colors data-[focus]:bg-gray-700 data-[selected]:text-indigo-400"
                        >
                          {o.label}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Listbox>
                ) : (
                  <input
                    type="text"
                    value={values[f.key]}
                    onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Tooltip text={t('action.cancel')}>
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
              >
                {t('action.cancel')}
              </button>
            </Tooltip>
            <Tooltip text={t('action.save')}>
              <button
                onClick={() => onSave(values)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-500"
              >
                {t('action.save')}
              </button>
            </Tooltip>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default EditModal
