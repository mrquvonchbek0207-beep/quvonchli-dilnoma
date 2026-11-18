import { useEffect, useState } from 'react'
import { Check, Copy, ExternalLink, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'

function ShareModal({ shareId, card, onClose }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const shareUrl = `${window.location.origin}/card/${shareId}`

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setCopyError(false)
    } catch (error) {
      console.error('Unable to copy the shared card link.', error)
      setCopyError(true)
      setCopied(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        className="relative my-auto w-full max-w-lg rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl shadow-black/20 sm:p-8 dark:border-slate-700 dark:bg-slate-900"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('shareModal.close')}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X size={19} aria-hidden="true" />
        </button>

        <div className="pr-10">
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
            {t('shareModal.saved')}
          </p>
          <h2
            id="share-modal-title"
            className="mt-1 font-display text-2xl text-slate-900 dark:text-white"
          >
            {t('shareModal.title')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('shareModal.description', { name: card.recipient_name || t('editor.recipientPlaceholder') })}
          </p>
        </div>

        <div className="mt-6 flex justify-center rounded-2xl bg-rose-50 p-5 dark:bg-slate-950">
          <QRCodeSVG
            value={shareUrl}
            size={184}
            level="H"
            includeMargin
            title={t('shareModal.qrCode')}
            bgColor="#ffffff"
            fgColor="#881337"
          />
        </div>

        <label
          htmlFor="share-link"
          className="mb-2 mt-6 block text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          {t('shareModal.linkLabel')}
        </label>
        <div className="flex gap-2">
          <input
            id="share-link"
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(event) => event.target.select()}
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
          <button
            type="button"
            onClick={copyShareLink}
            aria-label={copied ? t('shareModal.copied') : t('shareModal.copyLink')}
            className="grid size-12 shrink-0 place-items-center rounded-xl bg-rose-600 text-white transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
          >
            {copied ? <Check size={19} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
          </button>
        </div>

        {copied ? (
          <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-300" role="status">
            {t('shareModal.copied')}
          </p>
        ) : null}
        {copyError ? (
          <p className="mt-2 text-sm text-red-700 dark:text-red-300" role="alert">
            {t('shareModal.copyError')}
          </p>
        ) : null}

        <a
          href={shareUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-slate-700 dark:text-rose-200 dark:hover:bg-slate-800"
        >
          {t('shareModal.openCard')}
          <ExternalLink size={16} aria-hidden="true" />
        </a>
      </section>
    </div>
  )
}

export default ShareModal
