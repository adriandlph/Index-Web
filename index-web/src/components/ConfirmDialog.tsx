import { useTranslation } from 'react-i18next'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

type ConfirmDialogProps = {
  message: string
  onConfirm: () => void
  onClose: () => void
}

function ConfirmDialog({ message, onConfirm, onClose }: ConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-sm rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl">
          <DialogTitle className="sr-only">{t('action.confirm')}</DialogTitle>
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
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default ConfirmDialog
