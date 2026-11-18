import { useEffect, useState } from 'react'
import { ArrowRight, LoaderCircle, MessageSquareQuote, PanelsTopLeft, Tags } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { fetchAllQuotes, fetchAllTemplates, fetchCategories } from '../../services/api.js'

function AdminDashboard() {
  const { t } = useTranslation()
  const [counts, setCounts] = useState(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true

    async function loadCounts() {
      try {
        const categories = await fetchCategories()
        const [templates, quotes] = await Promise.all([
          fetchAllTemplates(categories),
          fetchAllQuotes(categories),
        ])
        if (active) {
          setCounts({
            categories: categories.length,
            templates: templates.length,
            quotes: quotes.length,
          })
          setHasError(false)
        }
      } catch (error) {
        console.error('Unable to load admin dashboard counts.', error)
        if (active) setHasError(true)
      }
    }

    loadCounts()
    return () => {
      active = false
    }
  }, [])

  const summaries = [
    { key: 'categories', icon: Tags, to: '/admin/categories' },
    { key: 'templates', icon: PanelsTopLeft, to: '/admin/templates' },
    { key: 'quotes', icon: MessageSquareQuote, to: '/admin/quotes' },
  ]

  return (
    <main>
      <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
        {t('admin.eyebrow')}
      </p>
      <h2 className="mt-2 font-display text-3xl text-slate-900 dark:text-white">
        {t('admin.dashboardTitle')}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
        {t('admin.dashboardDescription')}
      </p>

      {hasError ? (
        <p role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {t('admin.loadError')}
        </p>
      ) : counts === null ? (
        <div role="status" className="mt-8 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />
          {t('admin.loading')}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {summaries.map(({ key, icon: Icon, to }) => (
            <Link
              key={key}
              to={to}
              className="group rounded-2xl border border-rose-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="grid size-11 place-items-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                <Icon size={20} aria-hidden="true" />
              </span>
              <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                {t(`admin.count.${key}`)}
              </p>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-display text-3xl text-slate-900 dark:text-white">
                  {counts[key]}
                </span>
                <ArrowRight size={19} className="text-rose-500 transition group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      )}

      <p className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100">
        {t('admin.localStorageNote')}
      </p>
    </main>
  )
}

export default AdminDashboard
