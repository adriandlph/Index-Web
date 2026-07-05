import { useTranslation } from 'react-i18next'
import Tooltip from './Tooltip.tsx'

type BulkActionBarProps = {
  count: number
  onDelete: () => void
}

function BulkActionBar({ count, onDelete }: BulkActionBarProps) {
  const { t } = useTranslation()

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
      <div className="flex items-center gap-4 rounded-xl border border-gray-600/50 bg-gray-800/90 px-5 py-3 shadow-2xl backdrop-blur-md">
        <span className="text-sm text-gray-300">
          {count} {t('table.selected')}
        </span>
        <Tooltip text={t('action.delete_selected')}>
          <button
            onClick={onDelete}
            className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white transition-colors hover:bg-red-500"
          >
            {t('action.delete_selected')}
          </button>
        </Tooltip>
      </div>
    </div>
  )
}

export default BulkActionBar
