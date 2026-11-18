import { useEffect, useState } from 'react'
import { CalendarDays, Gift, Heart, LoaderCircle, Mail, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { fetchCategories, fetchTemplatesByCategory } from '../services/api.js'
import TemplatesGrid from '../components/TemplatesGrid.jsx'

const categoryIcons = {
  gift: Gift,
  mail: Mail,
  envelope: Mail,
  heart: Heart,
  calendar: CalendarDays,
  'calendar-days': CalendarDays,
}

function getLocalizedCategoryName(category, language) {
  return category[`name_${language}`] || category.name_en || category.name_uz
}

function Dashboard() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [templates, setTemplates] = useState([])
  const [categoryError, setCategoryError] = useState(false)
  const [templateError, setTemplateError] = useState(false)
  const [categoryRetry, setCategoryRetry] = useState(0)
  const [templateRetry, setTemplateRetry] = useState(0)
  const [completedCategoryRequest, setCompletedCategoryRequest] = useState(null)
  const [completedTemplateRequest, setCompletedTemplateRequest] = useState(null)

  const categoriesLoading = completedCategoryRequest !== categoryRetry
  const templateRequestKey =
    activeCategoryId === null ? null : `${activeCategoryId}:${templateRetry}`
  const templatesLoading =
    templateRequestKey !== null && completedTemplateRequest !== templateRequestKey
  const language = (i18n.resolvedLanguage || i18n.language).split('-')[0]

  useEffect(() => {
    let active = true
    fetchCategories()
      .then((data) => {
        if (active) {
          setCategories(data)
          setCategoryError(false)
          setActiveCategoryId((currentCategoryId) =>
            data.some((category) => category.id === currentCategoryId)
              ? currentCategoryId
              : data[0]?.id ?? null,
          )
        }
      })
      .catch((error) => {
        console.error('Unable to fetch categories.', error)
        if (active) {
          setCategoryError(true)
        }
      })
      .finally(() => {
        if (active) {
          setCompletedCategoryRequest(categoryRetry)
        }
      })

    return () => {
      active = false
    }
  }, [categoryRetry])

  useEffect(() => {
    if (activeCategoryId === null) {
      return undefined
    }

    let active = true
    fetchTemplatesByCategory(activeCategoryId)
      .then((data) => {
        if (active) {
          setTemplates(data)
          setTemplateError(false)
        }
      })
      .catch((error) => {
        console.error(`Unable to fetch templates for category ${activeCategoryId}.`, error)
        if (active) {
          setTemplateError(true)
        }
      })
      .finally(() => {
        if (active) {
          setCompletedTemplateRequest(templateRequestKey)
        }
      })

    return () => {
      active = false
    }
  }, [activeCategoryId, templateRetry, templateRequestKey])

  const activeCategory = categories.find((category) => category.id === activeCategoryId)

  function handleCreate(template) {
    navigate('/editor', { state: { template } })
  }

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-rose-100 dark:border-slate-800">
        <div className="absolute -right-32 -top-40 -z-10 size-[30rem] rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute -bottom-48 left-1/3 -z-10 size-96 rounded-full bg-amber-100/70 blur-3xl dark:bg-amber-900/10" />
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 sm:pb-10 sm:pt-20 lg:px-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-slate-900/80 dark:text-rose-200">
            <Sparkles size={16} aria-hidden="true" />
            {t('gallery.eyebrow')}
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-tight tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            {t('gallery.title')}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
            {t('gallery.description')}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-slate-900 dark:text-white">
            {t('gallery.categories')}
          </h2>
          {categoriesLoading ? (
            <LoaderCircle className="animate-spin text-rose-500" size={20} aria-label={t('gallery.loadingCategories')} />
          ) : null}
        </div>

        {categoryError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              {t('gallery.categoriesError')}
            </p>
            <button
              type="button"
              onClick={() => setCategoryRetry((attempt) => attempt + 1)}
              className="mt-3 rounded-full bg-white px-4 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 dark:bg-slate-900 dark:text-red-200 dark:hover:bg-red-950"
            >
              {t('gallery.retry')}
            </button>
          </div>
        ) : !categoriesLoading && categories.length === 0 ? (
          <p className="rounded-2xl border border-rose-100 bg-white px-5 py-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {t('gallery.noCategories')}
          </p>
        ) : (
          <div
            aria-label={t('gallery.categories')}
            className="flex snap-x gap-3 overflow-x-auto pb-3 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-4"
          >
            {categories.map((category) => {
              const Icon = categoryIcons[category.icon?.toLowerCase()] || Sparkles
              const isActive = category.id === activeCategoryId

              return (
                <button
                  type="button"
                  key={category.id}
                  aria-pressed={isActive}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`flex min-w-48 snap-start items-center gap-3 rounded-2xl border p-4 text-left transition duration-200 sm:min-w-0 ${
                    isActive
                      ? 'border-rose-300 bg-rose-100/80 text-rose-800 shadow-sm dark:border-rose-800 dark:bg-rose-950/70 dark:text-rose-100'
                      : 'border-rose-100 bg-white/80 text-slate-700 hover:border-rose-200 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-900'
                  }`}
                >
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${
                    isActive
                      ? 'bg-white text-rose-600 dark:bg-slate-900 dark:text-rose-300'
                      : 'bg-rose-50 text-rose-500 dark:bg-slate-800 dark:text-rose-300'
                  }`}>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="font-semibold">
                    {getLocalizedCategoryName(category, language)}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <div className="mb-6 mt-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-rose-600 dark:text-rose-300">
              {activeCategory ? getLocalizedCategoryName(activeCategory, language) : t('gallery.templates')}
            </p>
            <h2 className="mt-1 font-display text-2xl text-slate-900 dark:text-white">
              {t('gallery.templates')}
            </h2>
          </div>
          {activeCategory && !templatesLoading && !templateError ? (
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {t('gallery.templateCount', { count: templates.length })}
            </span>
          ) : null}
        </div>

        <TemplatesGrid
          key={activeCategoryId ?? 'no-category'}
          activeCategoryId={activeCategoryId}
          templates={templates}
          isLoading={categoriesLoading || templatesLoading}
          hasError={templateError}
          onRetry={() => setTemplateRetry((attempt) => attempt + 1)}
          onCreate={handleCreate}
        />
      </section>
    </main>
  )
}

export default Dashboard
