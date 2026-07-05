import { useTranslation } from 'react-i18next'

type ConfirmDialogProps = {
  message: string
  onConfirm: () => void
  onClose: () => void
}

function ConfirmDialog({ message, onConfirm, onClose }: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-200 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
          >
            {t('action.cancel')}
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-500"
          >
            {t('action.delete')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
