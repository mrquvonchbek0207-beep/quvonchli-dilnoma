import { useMemo } from 'react'
import { Heart, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import EnvelopeAnim from '../components/EnvelopeAnim.jsx'
import { loadSharedCard } from '../services/cardStorage.js'

const demoCard = {
  id: 'demo123',
  slug: 'demo123',
  template_id: 1,
  sender_name: 'Aziza',
  recipient_name: 'Malika',
  message: 'Har bir kuningiz quvonch va ezgu tilaklarga to‘lsin!',
  lang: 'uz',
  theme_mode: 'light',
  template: {
    id: 1,
    category_id: 1,
    name_uz: 'Mehr bilan',
    name_ru: 'С теплом',
    name_en: 'With love',
    style_config: {},
    preview_img: null,
  },
}

function PublicCard() {
  const { t } = useTranslation()
  const { id } = useParams()
  const card = useMemo(
    () => loadSharedCard(id) || (id === 'demo123' ? demoCard : null),
    [id],
  )

  if (!card) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl items-center justify-center px-4 py-16">
        <div className="w-full rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
            <Heart size={22} aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl text-slate-900 dark:text-white">
            {t('publicCard.notFound')}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {t('publicCard.notFoundDescription')}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            {t('publicCard.home')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative isolate min-h-[calc(100vh-73px)] overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="pointer-events-none absolute -left-40 top-20 -z-10 size-96 rounded-full bg-rose-200/40 blur-3xl dark:bg-rose-900/20" />
      <div className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-96 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-900/10" />
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center sm:mb-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-slate-900/80 dark:text-rose-200">
            <Sparkles size={16} aria-hidden="true" />
            {t('publicCard.eyebrow')}
          </p>
          <h1 className="mt-5 font-display text-3xl leading-tight text-slate-900 sm:text-4xl dark:text-white">
            {t('publicCard.title', {
              name: card.recipient_name || t('editor.recipientPlaceholder'),
            })}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base dark:text-slate-400">
            {t('publicCard.description')}
          </p>
        </header>

        <EnvelopeAnim card={card} />
      </div>
    </main>
  )
}

export default PublicCard
