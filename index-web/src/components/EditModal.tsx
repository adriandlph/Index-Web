import { useState } from 'react'
import { useTranslation } from 'react-i18next'

type Field = {
  key: string
  label: string
  value: string
  options?: { value: string; label: string }[]
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-sm text-gray-400 mb-1">{f.label}</label>
              {f.options ? (
                <select
                  value={values[f.key]}
                  onChange={(e) =>
                    setValues({ ...values, [f.key]: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200"
                >
                  {f.options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={values[f.key]}
                  onChange={(e) =>
                    setValues({ ...values, [f.key]: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
          >
            {t('action.cancel')}
          </button>
          <button
            onClick={() => onSave(values)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white transition-colors hover:bg-indigo-500"
          >
            {t('action.save')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditModal
