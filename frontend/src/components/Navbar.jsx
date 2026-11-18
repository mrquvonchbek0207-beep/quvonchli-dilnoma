import { useState } from 'react'
import { Heart, Menu, Moon, Sun, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { useTheme } from '../context/useTheme.js'
import i18n from '../i18n/i18n.js'
import InstallApp from './InstallApp.jsx'

const languages = [
  { code: 'uz', label: 'O‘zbekcha' },
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
]

function Navbar() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, logout, user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200'
        : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-200'
    }`

  return (
    <header className="border-b border-rose-100/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-xl text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500 dark:text-white"
          onClick={() => setMenuOpen(false)}
        >
          <span className="grid size-10 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
            <Heart size={20} fill="currentColor" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Joyful Dilnoma</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <InstallApp />
          <label className="sr-only" htmlFor="language-switcher">
            {t('navbar.language')}
          </label>
          <select
            id="language-switcher"
            value={i18n.resolvedLanguage || i18n.language}
            onChange={(event) => i18n.changeLanguage(event.target.value)}
            className="max-w-28 cursor-pointer rounded-full border border-rose-100 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-rose-950"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code}>
                {language.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? t('navbar.switchToLight') : t('navbar.switchToDark')}
            className="grid size-10 place-items-center rounded-full text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-200"
          >
            {theme === 'dark' ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
          </button>

          <button
            type="button"
            aria-label={menuOpen ? t('navbar.closeMenu') : t('navbar.openMenu')}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
            className="grid size-10 place-items-center rounded-full text-slate-600 hover:bg-rose-50 md:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav
          aria-label={t('navbar.mainNavigation')}
          className={`${menuOpen ? 'flex' : 'hidden'} w-full flex-col gap-1 border-t border-rose-100 pt-3 md:flex md:w-auto md:flex-row md:items-center md:gap-2 md:border-0 md:pt-0 dark:border-slate-800`}
        >
          <NavLink to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            {t('navbar.home')}
          </NavLink>
          <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
            {t('navbar.gallery')}
          </NavLink>
          {!isLoading && isAuthenticated ? (
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
              <span className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
                {t('navbar.welcomeUser', { name: user.full_name })}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-left text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-200"
              >
                {t('navbar.logout')}
              </button>
            </div>
          ) : !isLoading ? (
            <NavLink to="/login" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              {t('navbar.login')}
            </NavLink>
          ) : null}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
