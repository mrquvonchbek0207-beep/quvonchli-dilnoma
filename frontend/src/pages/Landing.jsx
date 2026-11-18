import { ArrowRight, HeartHandshake, Languages, Send } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const features = [
  { key: 'thoughtful', Icon: HeartHandshake },
  { key: 'multilingual', Icon: Languages },
  { key: 'easy', Icon: Send },
]

function Landing() {
  const { t } = useTranslation()

  return (
    <main>
      <section className="relative isolate overflow-hidden">
        <div className="absolute -right-24 -top-32 -z-10 size-96 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-900/20" />
        <div className="absolute -bottom-48 -left-24 -z-10 size-96 rounded-full bg-amber-100/70 blur-3xl dark:bg-amber-900/10" />
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-32">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-slate-900/80 dark:text-rose-200">
              <span className="size-2 rounded-full bg-rose-500" />
              {t('landing.eyebrow')}
            </p>
            <h1 className="font-display text-5xl leading-[1.08] tracking-tight text-slate-900 sm:text-6xl dark:text-white">
              {t('landing.title')}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {t('landing.description')}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:-translate-y-0.5 hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                {t('landing.createCard')}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                to="/login"
                className="rounded-full px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-white dark:text-slate-200 dark:hover:bg-slate-900"
              >
                {t('landing.signIn')}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rotate-3 rounded-[2rem] bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 dark:from-rose-950 dark:via-slate-800 dark:to-amber-950" />
            <div className="relative rounded-[1.75rem] border border-white/80 bg-white p-7 shadow-2xl shadow-rose-900/10 sm:p-9 dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-rose-600 dark:bg-rose-950 dark:text-rose-200">
                  {t('landing.cardLabel')}
                </span>
                <span className="text-rose-400" aria-hidden="true">
                  <HeartHandshake size={22} />
                </span>
              </div>
              <div className="py-12 text-center">
                <p className="font-display text-3xl leading-snug text-slate-800 dark:text-slate-100">
                  {t('landing.cardQuote')}
                </p>
                <div className="mx-auto mt-7 h-px w-12 bg-rose-200 dark:bg-rose-800" />
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{t('landing.cardNote')}</p>
              </div>
              <div className="flex items-center justify-between border-t border-rose-100 pt-5 text-sm dark:border-slate-700">
                <span className="font-medium text-slate-500 dark:text-slate-400">Joyful Dilnoma</span>
                <HeartHandshake size={18} className="text-rose-500" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-rose-100 bg-white/70 py-16 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {features.map(({ key, Icon }) => (
            <article key={key} className="rounded-2xl border border-rose-100 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
                <Icon size={21} aria-hidden="true" />
              </span>
              <h2 className="font-display text-xl text-slate-900 dark:text-white">
                {t(`landing.features.${key}`)}
              </h2>
              <p className="mt-2 leading-6 text-slate-600 dark:text-slate-400">
                {t(`landing.features.${key}Description`)}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Landing
