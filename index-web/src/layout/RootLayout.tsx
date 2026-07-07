import { Outlet, Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '../config/routes.ts'
import contact from '../config/contact.json'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react'
import Tooltip from '../components/Tooltip.tsx'

const langs = ['es', 'gl', 'ca', 'eu', 'pt', 'en', 'it', 'de', 'fr', 'sv', 'ru', 'ja', 'zh', 'ko', 'hi']

function Flag({ code, className }: { code: string; className?: string }) {
  const cls = `inline-block rounded-sm ${className ?? 'h-4 w-6'}`
  switch (code) {
    case 'es':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#c60b1e" />
          <rect y="3.5" width="20" height="7" fill="#ffc400" />
        </svg>
      )
    case 'en':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#012169" />
          <rect x="8.5" width="3" height="14" fill="#fff" />
          <rect y="5.5" width="20" height="3" fill="#fff" />
          <rect x="9.5" width="1.5" height="14" fill="#c8102e" />
          <rect y="6.5" width="20" height="1.5" fill="#c8102e" />
          <polygon points="0,0 20,14" fill="#fff" opacity="0.4" />
          <polygon points="20,0 0,14" fill="#fff" opacity="0.4" />
          <polygon points="0,0 20,14" fill="#c8102e" opacity="0.4" transform="scale(0.5) translate(10,7)" />
          <polygon points="20,0 0,14" fill="#c8102e" opacity="0.4" transform="scale(0.5) translate(0,7)" />
        </svg>
      )
    case 'it':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="6.7" height="14" fill="#009246" />
          <rect x="6.7" width="6.6" height="14" fill="#fff" />
          <rect x="13.3" width="6.7" height="14" fill="#ce2b37" />
        </svg>
      )
    case 'de':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="4.7" fill="#000" />
          <rect y="4.7" width="20" height="4.6" fill="#dd0000" />
          <rect y="9.3" width="20" height="4.7" fill="#ffce00" />
        </svg>
      )
    case 'fr':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="6.7" height="14" fill="#002395" />
          <rect x="6.7" width="6.6" height="14" fill="#fff" />
          <rect x="13.3" width="6.7" height="14" fill="#ed2939" />
        </svg>
      )
    case 'ca':
      return (
        <svg className={cls} viewBox="0 0 18 9">
          <rect width="18" height="9" fill="#ffd700" />
          {[0, 2, 4, 6, 8].map((y) => (
            <rect key={y} y={y} width="18" height="1" fill="#c8102e" />
          ))}
        </svg>
      )
    case 'gl':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#fff" />
          <g transform="rotate(35, 10, 7)">
            <rect x="-3" y="5.5" width="26" height="3" fill="#005fbf" />
          </g>
        </svg>
      )
    case 'sv':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#005baa" />
          <rect x="5.5" width="2.5" height="14" fill="#fecc00" />
          <rect y="5.5" width="20" height="3" fill="#fecc00" />
        </svg>
      )
    case 'eu':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#d80000" />
          <g transform="rotate(35, 10, 7)">
            <rect x="-4" y="4.5" width="28" height="5" fill="#fff" />
          </g>
          <g transform="rotate(-35, 10, 7)">
            <rect x="-4" y="4.5" width="28" height="5" fill="#fff" />
          </g>
          <g transform="rotate(35, 10, 7)">
            <rect x="-2.5" y="5.5" width="25" height="3" fill="#009b48" />
          </g>
          <g transform="rotate(-35, 10, 7)">
            <rect x="-2.5" y="5.5" width="25" height="3" fill="#009b48" />
          </g>
        </svg>
      )
    case 'pt':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="8" height="14" fill="#006600" />
          <rect x="8" width="12" height="14" fill="#ff0000" />
          <circle cx="9.5" cy="7" r="3.2" fill="#ffcc00" />
          <circle cx="9.5" cy="7" r="2" fill="#fff" />
          <circle cx="9.5" cy="7" r="1.3" fill="#ff0000" />
        </svg>
      )
    case 'ru':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="4.7" fill="#fff" />
          <rect y="4.7" width="20" height="4.6" fill="#0039a6" />
          <rect y="9.3" width="20" height="4.7" fill="#d52b1e" />
        </svg>
      )
    case 'ja':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#fff" />
          <circle cx="10" cy="7" r="4" fill="#bc002d" />
        </svg>
      )
    case 'zh':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#de2910" />
          <polygon points="3,2 3.8,4.5 6.5,4.5 4.3,6.2 5.1,8.7 3,7.1 0.9,8.7 1.7,6.2 -0.5,4.5 2.2,4.5" fill="#ffde00" />
          <polygon points="8,1.5 8.3,2.5 9.3,2.5 8.5,3.2 8.8,4.2 8,3.6 7.2,4.2 7.5,3.2 6.7,2.5 7.7,2.5" fill="#ffde00" />
          <polygon points="10,3.5 10.3,4.5 11.3,4.5 10.5,5.2 10.8,6.2 10,5.6 9.2,6.2 9.5,5.2 8.7,4.5 9.7,4.5" fill="#ffde00" />
          <polygon points="9,5.5 9.3,6.5 10.3,6.5 9.5,7.2 9.8,8.2 9,7.6 8.2,8.2 8.5,7.2 7.7,6.5 8.7,6.5" fill="#ffde00" />
        </svg>
      )
    case 'ko':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="14" fill="#fff" />
          <g transform="translate(10,7)">
            <circle r="4.5" fill="#c60c30" />
            <path d="M-4.5,0 A4.5,4.5 0 0,1 4.5,0 A4.5,4.5 0 0,0 -4.5,0" fill="#003478" />
          </g>
          <rect x="0" y="0" width="20" height="1" fill="#000" opacity="0.1" />
        </svg>
      )
    case 'hi':
      return (
        <svg className={cls} viewBox="0 0 20 14">
          <rect width="20" height="4.7" fill="#ff9933" />
          <rect y="4.7" width="20" height="4.6" fill="#fff" />
          <circle cx="10" cy="7" r="2" fill="#000080" opacity="0.7" />
          <rect y="9.3" width="20" height="4.7" fill="#138808" />
        </svg>
      )
    default:
      return null
  }
}

const langLabel: Record<string, string> = {
  es: 'ESP', en: 'ENG', gl: 'GAL', ca: 'CAT', eu: 'EUS',
  pt: 'POR', it: 'ITA', de: 'DEU', fr: 'FRA', sv: 'SVE',
  ru: 'RUS', ja: 'JPN', zh: 'CHN', ko: 'KOR', hi: 'HIN',
}

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
    <div className="bg-gray-900 min-h-[calc(100dvh+200px)] flex flex-col">
      <header className="shrink-0 border-b border-gray-800">
        <div className="flex items-center justify-between px-8 py-4">
          <Link to={ROUTES.home} className="flex items-center gap-2 text-xl font-bold text-white tracking-tight">
            <svg className="h-7 w-7" viewBox="0 0 24 24">
              <rect x="2.5" y="2.5" width="19" height="19" rx="3" fill="#6366f1" />
              <rect x="5" y="6" width="14" height="5" rx="1.5" fill="#eef2ff" />
              <rect x="5" y="13" width="14" height="5" rx="1.5" fill="#eef2ff" />
              <rect x="10" y="7.5" width="4" height="2" rx="1" fill="#6366f1" />
              <rect x="10" y="14.5" width="4" height="2" rx="1" fill="#6366f1" />
            </svg>
            {t('nav.brand')}
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
            <Tooltip text="Language" position="bottom">
            <Listbox
              value={i18n.language}
              onChange={(l) => {
                i18n.changeLanguage(l)
                localStorage.setItem('index-web-lang', l)
              }}
            >
              <ListboxButton className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700">
                <Flag code={i18n.language} className="h-4 w-5" />
                <span>{langLabel[i18n.language] ?? i18n.language.toUpperCase()}</span>
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </ListboxButton>
              <ListboxOptions className="z-50 mt-1 rounded-lg border border-gray-700 bg-gray-800 p-2 text-sm shadow-xl" anchor="bottom end">
                <div className="grid grid-cols-3 grid-rows-5 grid-flow-col gap-1">
                  {langs.map((l) => (
                    <ListboxOption
                      key={l}
                      value={l}
                      className="cursor-pointer rounded px-3 py-2 text-gray-300 transition-colors data-[focus]:bg-gray-700 data-[selected]:text-indigo-400"
                    >
                      <Flag code={l} className="h-4 w-5 mr-2 align-middle" />
                      <span className="align-middle">{langLabel[l]}</span>
                    </ListboxOption>
                  ))}
                </div>
              </ListboxOptions>
            </Listbox>
            </Tooltip>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-800 px-8 py-8 h-[200px] flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-2 text-sm text-gray-400">
          <a href={`tel:${contact.phone}`} className="flex items-center gap-2 transition-colors hover:text-gray-200">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {contact.phone}
          </a>
          <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition-colors hover:text-gray-200">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {contact.email}
          </a>
        </div>
        <p className="text-xs text-gray-600">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </p>
      </footer>
    </div>
  )
}

export default RootLayout
