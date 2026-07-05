import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../config/routes.ts'

const langs = ['es', 'en', 'it', 'de', 'fr', 'ca', 'gl', 'sv', 'eu']

function RootLayout() {
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  const navItems = [
    { to: ROUTES.home, label: t('nav.home') },
    { to: ROUTES.division, label: t('nav.division') },
    { to: ROUTES.department, label: t('nav.department') },
    { to: ROUTES.project, label: t('nav.project') },
    { to: ROUTES.product, label: t('nav.product') },
  ]

  return (
    <div className="min-h-svh bg-gray-900 flex flex-col">
      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to={ROUTES.home} className="text-xl font-bold text-white tracking-tight">
            Index<span className="text-indigo-400">Web</span>
          </Link>
          <div className="flex items-center gap-4">
            <nav className="flex gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <select
              value={i18n.language}
              onChange={(e) => {
                i18n.changeLanguage(e.target.value)
                localStorage.setItem('index-web-lang', e.target.value)
              }}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300"
            >
              {langs.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout
