import { useTranslation } from 'react-i18next'

function ErrorState() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <div className="w-full max-w-sm rounded-xl border border-red-800/40 bg-red-950/20 p-8 text-center shadow-lg backdrop-blur-sm">
        <div className="mb-5 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-900/40">
            <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>
        <p className="text-base leading-relaxed text-gray-300">{t('table.server_error')}</p>
      </div>
    </div>
  )
}

export default ErrorState
