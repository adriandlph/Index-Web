import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../config/routes.ts'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import Tooltip from '../components/Tooltip.tsx'

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
            <Tooltip text={t('nav.language')}>
            <Listbox
              value={i18n.language}
              onChange={(l) => {
                i18n.changeLanguage(l)
                localStorage.setItem('index-web-lang', l)
              }}
            >
              <ListboxButton className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700">
                {i18n.language.toUpperCase()}
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </ListboxButton>
              <ListboxOptions className="z-50 mt-1 rounded-lg border border-gray-700 bg-gray-800 py-1 text-sm shadow-xl" anchor="bottom end">
                {langs.map((l) => (
                  <ListboxOption
                    key={l}
                    value={l}
                    className="cursor-pointer px-3 py-2 text-gray-300 transition-colors data-[focus]:bg-gray-700 data-[selected]:text-indigo-400"
                  >
                    {l.toUpperCase()}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
            </Tooltip>
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
