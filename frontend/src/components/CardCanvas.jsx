import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import templatePlaceholder from '../assets/template-placeholder.svg'

function CardCanvas({ template, senderName, recipientName, message }) {
  const { t } = useTranslation()

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-rose-100 shadow-2xl shadow-rose-950/15 dark:bg-slate-800 dark:shadow-black/40">
      <img
        src={template.preview_img || templatePlaceholder}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = templatePlaceholder
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950/15 via-transparent to-amber-950/20 dark:from-slate-950/35 dark:to-slate-950/40" />
      <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8">
        <article className="w-full max-w-lg rounded-3xl border border-white/80 bg-white/85 px-5 py-7 text-center shadow-xl shadow-rose-950/10 backdrop-blur-md sm:px-10 sm:py-9 dark:border-white/10 dark:bg-slate-950/80">
          <Heart
            size={24}
            className="mx-auto mb-4 text-rose-500"
            fill="currentColor"
            aria-hidden="true"
          />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-300">
            {t('editor.previewTo')}
          </p>
          <h2 className="mt-2 break-words font-display text-3xl leading-tight text-slate-900 sm:text-4xl dark:text-white">
            {recipientName.trim() || t('editor.recipientPlaceholder')}
          </h2>
          <div className="mx-auto my-5 h-px w-14 bg-rose-200 dark:bg-rose-800" />
          <p className="max-h-36 overflow-y-auto whitespace-pre-wrap break-words font-display text-lg leading-relaxed text-slate-700 sm:text-xl dark:text-slate-200">
            {message.trim() || t('editor.messagePlaceholder')}
          </p>
          <p className="mt-6 break-words text-sm font-medium italic text-slate-500 dark:text-slate-400">
            {t('editor.previewFrom', {
              name: senderName.trim() || t('editor.senderPlaceholder'),
            })}
          </p>
        </article>
      </div>
    </div>
  )
}

export default CardCanvas
