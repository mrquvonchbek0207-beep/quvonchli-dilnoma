import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import templatePlaceholder from '../assets/template-placeholder.svg'

function CardCanvas({
  template,
  senderName,
  recipientName,
  message,
  themeMode = 'light',
}) {
  const { t } = useTranslation()
  const isDark = themeMode === 'dark'

  return (
    <div className="relative isolate flex h-auto min-h-[360px] w-full items-center justify-center overflow-hidden rounded-[2rem] bg-cover bg-center bg-rose-100 shadow-2xl shadow-rose-950/15 dark:bg-slate-800 dark:shadow-black/40">
      <img
        src={template.preview_img || templatePlaceholder}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full bg-cover bg-center object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = templatePlaceholder
        }}
      />
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-gradient-to-br from-black/20 via-transparent to-black/35'
            : 'bg-gradient-to-br from-rose-950/10 via-transparent to-amber-950/15'
        }`}
      />
      <article
        className={`relative mx-4 my-8 w-full max-w-lg rounded-3xl border px-5 py-8 text-center shadow-xl shadow-rose-950/10 backdrop-blur-md sm:mx-8 sm:px-10 sm:py-10 ${
          isDark
            ? 'border-white/15 bg-black/35 text-white'
            : 'border-white/70 bg-white/65 text-slate-900'
        }`}
      >
        <div className="mx-auto mb-4 flex w-24 items-center justify-center gap-2">
          <span className={`h-px flex-1 ${isDark ? 'bg-white/35' : 'bg-rose-300/70'}`} />
          <Heart
            size={20}
            className={isDark ? 'text-rose-200' : 'text-rose-500'}
            fill="currentColor"
            aria-hidden="true"
          />
          <span className={`h-px flex-1 ${isDark ? 'bg-white/35' : 'bg-rose-300/70'}`} />
        </div>
        <p
          className={`text-xs font-semibold uppercase tracking-[0.2em] ${
            isDark ? 'text-rose-200' : 'text-rose-700'
          }`}
        >
          {t('editor.previewTo')}
        </p>
        <h2 className="mt-2 break-words font-display text-3xl leading-tight sm:text-4xl">
          {recipientName.trim() || t('editor.recipientPlaceholder')}
        </h2>
        <div className="mx-auto my-5 flex w-28 items-center gap-2">
          <span className={`h-px flex-1 ${isDark ? 'bg-white/25' : 'bg-rose-300/60'}`} />
          <span className={`size-1.5 rotate-45 ${isDark ? 'bg-rose-200/80' : 'bg-rose-400/80'}`} />
          <span className={`h-px flex-1 ${isDark ? 'bg-white/25' : 'bg-rose-300/60'}`} />
        </div>
        <p
          className={`mx-auto max-w-prose whitespace-pre-wrap break-words font-display text-base leading-relaxed sm:text-lg ${
            isDark ? 'text-white/95' : 'text-slate-800'
          }`}
        >
          {message.trim() || t('editor.messagePlaceholder')}
        </p>
        <div className="mx-auto mt-6 flex w-28 items-center gap-2">
          <span className={`h-px flex-1 ${isDark ? 'bg-white/25' : 'bg-rose-300/60'}`} />
          <span className={`size-1.5 rotate-45 ${isDark ? 'bg-rose-200/80' : 'bg-rose-400/80'}`} />
          <span className={`h-px flex-1 ${isDark ? 'bg-white/25' : 'bg-rose-300/60'}`} />
        </div>
        <p
          className={`mt-4 break-words font-display text-base italic sm:text-lg ${
            isDark ? 'text-white/80' : 'text-slate-700'
          }`}
        >
          {t('editor.previewFrom', {
            name: senderName.trim() || t('editor.senderPlaceholder'),
          })}
        </p>
      </article>
    </div>
  )
}

export default CardCanvas
