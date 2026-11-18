import { LayoutDashboard, LogOut, MessageSquareQuote, Tags, PanelsTopLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'

const adminLinks = [
  { to: '/admin', label: 'dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/categories', label: 'categories', icon: Tags },
  { to: '/admin/templates', label: 'templates', icon: PanelsTopLeft },
  { to: '/admin/quotes', label: 'quotes', icon: MessageSquareQuote },
]

function AdminLayout() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center">
        <p role="status" className="text-sm text-slate-500 dark:text-slate-400">
          {t('admin.loading')}
        </p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
      <aside className="w-full shrink-0 rounded-3xl border border-rose-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-6 lg:h-fit lg:w-64">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-300">
            {t('admin.eyebrow')}
          </p>
          <h1 className="mt-1 font-display text-2xl text-slate-900 dark:text-white">
            {t('admin.title')}
          </h1>
        </div>

        <nav
          aria-label={t('admin.navigation')}
          className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1"
        >
          {adminLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-rose-200'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {t(`admin.nav.${label}`)}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-rose-100 px-3 pt-4 dark:border-slate-800 lg:mt-6">
          <span className="min-w-0 truncate text-sm text-slate-500 dark:text-slate-400">
            {user?.full_name}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            aria-label={t('admin.logout')}
            className="grid size-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-200"
          >
            <LogOut size={17} aria-hidden="true" />
          </button>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <Outlet />
      </section>
    </div>
  )
}

export default AdminLayout
