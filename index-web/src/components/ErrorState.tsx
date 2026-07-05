import { useTranslation } from 'react-i18next'

function ErrorState({ message }: { message: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <p className="text-red-400">{t('table.error')}: {message}</p>
    </div>
  )
}

export default ErrorState
