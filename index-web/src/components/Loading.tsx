import { useTranslation } from 'react-i18next'

function Loading() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-indigo-500" />
      <span className="ml-3 text-gray-400">{t('table.loading')}</span>
    </div>
  )
}

export default Loading
