import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">{t('notFound.title')}</h1>
        <p className="text-gray-400 mb-6">{t('notFound.message')}</p>
        <Link
          to="/"
          className="inline-flex rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
        >
          {t('notFound.back')}
        </Link>
      </div>
    </div>
  )
}

export default NotFound
