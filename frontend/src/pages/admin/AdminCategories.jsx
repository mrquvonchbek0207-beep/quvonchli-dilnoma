import { useEffect, useState } from 'react'
import { LoaderCircle, Tags } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { fetchCategories } from '../../services/api.js'

function AdminCategories() {
  const { t } = useTranslation()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    let active = true
    fetchCategories()
      .then((data) => {
        if (active) {
          setCategories(data)
          setHasError(false)
        }
      })
      .catch((error) => {
        console.error('Unable to load admin categories.', error)
        if (active) setHasError(true)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [retry])

  return (
    <main>
      <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
        {t('admin.nav.categories')}
      </p>
      <h2 className="mt-2 font-display text-3xl text-slate-900 dark:text-white">
        {t('admin.categoriesTitle')}
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {t('admin.categoriesDescription')}
      </p>

      {isLoading ? (
        <div role="status" className="mt-8 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />
          {t('admin.loading')}
        </div>
      ) : hasError ? (
        <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <p>{t('admin.loadError')}</p>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true)
              setRetry((attempt) => attempt + 1)
            }}
            className="mt-3 rounded-lg bg-white px-3 py-2 font-semibold dark:bg-slate-900"
          >
            {t('admin.retry')}
          </button>
        </div>
      ) : categories.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-rose-200 p-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {t('admin.emptyCategories')}
        </p>
      ) : (
        <ul className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                <Tags size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900 dark:text-white">
                  {category.name_en}
                </p>
                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                  {category.name_uz} · {category.name_ru}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default AdminCategories
