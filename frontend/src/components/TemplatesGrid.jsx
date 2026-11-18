import { useState } from 'react'
import { ArrowRight, ArrowUpRight, Check, LoaderCircle, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import templatePlaceholder from '../assets/template-placeholder.svg'

function getLocalizedName(template, language) {
  return template[`name_${language}`] || template.name_en || template.name_uz
}

function TemplateCard({ template, language, isSelected, onSelect, onCreate }) {
  const { t } = useTranslation()
  const title = getLocalizedName(template, language)

  return (
    <motion.article
      layout
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-900/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:shadow-black/30"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-rose-50 dark:bg-slate-800">
        <img
          src={template.preview_img || templatePlaceholder}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = templatePlaceholder
          }}
        />
        <span className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/90 text-rose-600 shadow-sm backdrop-blur dark:bg-slate-950/85 dark:text-rose-300">
          <Sparkles size={18} aria-hidden="true" />
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-snug text-slate-900 dark:text-white">
            {title}
          </h3>
          <ArrowUpRight
            size={18}
            className="mt-1 shrink-0 text-rose-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </div>
        <button
          type="button"
          aria-pressed={isSelected}
          onClick={() => onSelect(template.id)}
          className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
            isSelected
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-rose-600 text-white shadow-sm shadow-rose-600/20 hover:bg-rose-700'
          }`}
        >
          {isSelected ? <Check size={17} aria-hidden="true" /> : null}
          {isSelected ? t('gallery.selected') : t('gallery.selectTemplate')}
        </button>
        <button
          type="button"
          onClick={() => onCreate(template)}
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 dark:border-slate-700 dark:bg-slate-900 dark:text-rose-200 dark:hover:border-rose-800 dark:hover:bg-slate-800"
        >
          {t('gallery.create')}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  )
}

function TemplatesGrid({
  activeCategoryId,
  templates,
  isLoading,
  hasError,
  onRetry,
  onCreate,
}) {
  const { t, i18n } = useTranslation()
  const [selectedTemplateId, setSelectedTemplateId] = useState(null)
  const language = (i18n.resolvedLanguage || i18n.language).split('-')[0]

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center" role="status">
        <LoaderCircle className="animate-spin text-rose-500" size={30} aria-hidden="true" />
        <span className="sr-only">{t('gallery.loadingTemplates')}</span>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-900 dark:bg-red-950/30">
        <p className="font-medium text-red-800 dark:text-red-200">{t('gallery.templatesError')}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-full bg-white px-5 py-2 text-sm font-semibold text-red-700 shadow-sm hover:bg-red-100 dark:bg-slate-900 dark:text-red-200 dark:hover:bg-red-950"
        >
          {t('gallery.retry')}
        </button>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-rose-200 bg-white/60 px-6 py-14 text-center dark:border-slate-700 dark:bg-slate-900/50">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
          <Sparkles size={22} aria-hidden="true" />
        </span>
        <p className="mt-4 font-display text-xl text-slate-800 dark:text-white">
          {t('gallery.noTemplates')}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {t('gallery.noTemplatesDescription')}
        </p>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategoryId}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0 }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            language={language}
            isSelected={selectedTemplateId === template.id}
            onSelect={setSelectedTemplateId}
            onCreate={onCreate}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export default TemplatesGrid
