import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Home() {
  const { t } = useTranslation()

  const cards = [
    { title: t('home.division'), desc: t('home.division_desc'), to: '/division' },
    { title: t('home.department'), desc: t('home.department_desc'), to: '/department' },
    { title: t('home.project'), desc: t('home.project_desc'), to: '/project' },
    { title: t('home.product'), desc: t('home.product_desc'), to: '/product' },
  ]

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold text-white mb-4">
          {t('home.title')}
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          {t('home.subtitle')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="group rounded-xl border border-gray-700 bg-gray-800/50 p-6 text-left transition-all hover:border-indigo-500 hover:bg-gray-800 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {card.title}
              </h2>
              <p className="mt-2 text-sm text-gray-400">{card.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
