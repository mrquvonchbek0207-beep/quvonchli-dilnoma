import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Heart, LoaderCircle, MessageCircleHeart, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import CardCanvas from '../components/CardCanvas.jsx'
import { fetchQuotesByCategory } from '../services/api.js'
import ShareModal from '../components/ShareModal.jsx'
import { useTheme } from '../context/useTheme.js'
import { createShareId, saveSharedCard } from '../services/cardStorage.js'

const relations = ['mother', 'friend', 'spouse']
const relationAliases = {
  mother: ['mother', 'mom', 'parent'],
  friend: ['friend'],
  spouse: ['spouse', 'partner', 'wife', 'husband'],
}

function getLocalizedQuote(quote, language) {
  return quote[`text_${language}`] || quote.text_uz || quote.text_en
}

function Editor() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const { state } = useLocation()
  const template = state?.template
  const language = (i18n.resolvedLanguage || i18n.language).split('-')[0]

  const [senderName, setSenderName] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [relation, setRelation] = useState('friend')
  const [message, setMessage] = useState('')
  const [quotes, setQuotes] = useState([])
  const [quotesError, setQuotesError] = useState(false)
  const [quotesRetry, setQuotesRetry] = useState(0)
  const [completedQuoteRequest, setCompletedQuoteRequest] = useState(null)
  const [shareId, setShareId] = useState(null)
  const [sharedCard, setSharedCard] = useState(null)
  const [shareError, setShareError] = useState(false)

  const categoryId = template?.category_id
  const quoteRequestKey =
    categoryId === undefined ? null : `${categoryId}:${quotesRetry}`
  const quotesLoading =
    quoteRequestKey !== null && completedQuoteRequest !== quoteRequestKey

  useEffect(() => {
    if (categoryId === undefined) {
      return undefined
    }

    let active = true
    fetchQuotesByCategory(categoryId)
      .then((data) => {
        if (active) {
          setQuotes(data)
          setQuotesError(false)
        }
      })
      .catch((error) => {
        console.error(`Unable to fetch quotes for category ${categoryId}.`, error)
        if (active) {
          setQuotesError(true)
        }
      })
      .finally(() => {
        if (active) {
          setCompletedQuoteRequest(quoteRequestKey)
        }
      })

    return () => {
      active = false
    }
  }, [categoryId, quoteRequestKey])

  const matchingQuotes = useMemo(() => {
    const acceptedRelations = relationAliases[relation]
    return quotes.filter(
      (quote) =>
        !quote.relation ||
        !acceptedRelations ||
        acceptedRelations.includes(quote.relation.toLowerCase()),
    )
  }, [quotes, relation])

  const handleSaveAndShare = useCallback(() => {
    const id = createShareId()
    const card = {
      id,
      slug: id,
      template_id: template.id,
      sender_name: senderName,
      recipient_name: recipientName,
      message,
      lang: language,
      theme_mode: theme,
      template,
    }

    try {
      saveSharedCard(card)
      setSharedCard(card)
      setShareId(id)
      setShareError(false)
    } catch (error) {
      console.error('Unable to save the card for local sharing.', error)
      setShareError(true)
    }
  }, [language, message, recipientName, senderName, template, theme])

  const handleCloseShare = useCallback(() => {
    setShareId(null)
    setSharedCard(null)
  }, [])

  if (!template) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl items-center justify-center px-4 py-16">
        <div className="w-full rounded-3xl border border-rose-100 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
            <Heart size={22} aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-display text-2xl text-slate-900 dark:text-white">
            {t('editor.missingTemplate')}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {t('editor.missingTemplateDescription')}
          </p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            <ArrowLeft size={17} aria-hidden="true" />
            {t('editor.backToGallery')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            {t('editor.backToGallery')}
          </Link>
          <p className="flex items-center gap-2 text-sm font-semibold text-rose-600 dark:text-rose-300">
            <Sparkles size={16} aria-hidden="true" />
            {t('editor.eyebrow')}
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {t('editor.title')}
          </h1>
        </div>
        <span className="rounded-full border border-rose-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          {template[`name_${language}`] || template.name_en || template.name_uz}
        </span>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <section className="rounded-3xl border border-rose-100 bg-white p-5 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6">
            <h2 className="font-display text-xl text-slate-900 dark:text-white">
              {t('editor.details')}
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {t('editor.detailsDescription')}
            </p>
          </div>

          <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="sender-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t('editor.senderName')}
                </label>
                <input
                  id="sender-name"
                  name="senderName"
                  type="text"
                  autoComplete="name"
                  maxLength={150}
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                  placeholder={t('editor.senderPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
                />
              </div>
              <div>
                <label htmlFor="recipient-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t('editor.recipientName')}
                </label>
                <input
                  id="recipient-name"
                  name="recipientName"
                  type="text"
                  maxLength={150}
                  value={recipientName}
                  onChange={(event) => setRecipientName(event.target.value)}
                  placeholder={t('editor.recipientPlaceholder')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
                />
              </div>
            </div>

            <div>
              <label htmlFor="recipient-relation" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {t('editor.relation')}
              </label>
              <select
                id="recipient-relation"
                value={relation}
                onChange={(event) => setRelation(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
              >
                {relations.map((value) => (
                  <option key={value} value={value}>
                    {t(`editor.relations.${value}`)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  {t('editor.message')}
                </label>
                <span className="text-xs text-slate-400">{message.length}/1000</span>
              </div>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={1000}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={t('editor.messagePlaceholder')}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
              />
            </div>
          </form>

          <section className="mt-7 border-t border-rose-100 pt-6 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <MessageCircleHeart size={19} className="text-rose-500" aria-hidden="true" />
              <h2 className="font-display text-lg text-slate-900 dark:text-white">
                {t('editor.quotes')}
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t('editor.quotesDescription')}
            </p>

            {quotesLoading ? (
              <div className="flex items-center gap-2 py-6 text-sm text-slate-500 dark:text-slate-400" role="status">
                <LoaderCircle size={18} className="animate-spin text-rose-500" aria-hidden="true" />
                {t('editor.loadingQuotes')}
              </div>
            ) : quotesError ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
                <p className="text-sm text-red-800 dark:text-red-200">{t('editor.quotesError')}</p>
                <button
                  type="button"
                  onClick={() => setQuotesRetry((attempt) => attempt + 1)}
                  className="mt-3 text-sm font-semibold text-red-700 underline decoration-red-300 underline-offset-4 dark:text-red-200"
                >
                  {t('editor.retry')}
                </button>
              </div>
            ) : matchingQuotes.length ? (
              <ul className="mt-4 space-y-2">
                {matchingQuotes.map((quote) => (
                  <li key={quote.id}>
                    <button
                      type="button"
                      onClick={() => setMessage(getLocalizedQuote(quote, language))}
                      className="w-full rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-left text-sm leading-6 text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
                    >
                      {getLocalizedQuote(quote, language)}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                {t('editor.noQuotes')}
              </p>
            )}
          </section>

          <div className="mt-7 border-t border-rose-100 pt-6 dark:border-slate-800">
            {shareError ? (
              <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-200" role="alert">
                {t('editor.shareError')}
              </p>
            ) : null}
            <button
              type="button"
              onClick={handleSaveAndShare}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-600/20 transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            >
              <Heart size={17} fill="currentColor" aria-hidden="true" />
              {t('editor.saveAndShare')}
            </button>
          </div>
        </section>

        <aside className="lg:sticky lg:top-8">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
                {t('editor.live')}
              </p>
              <h2 className="mt-1 font-display text-xl text-slate-900 dark:text-white">
                {t('editor.preview')}
              </h2>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              {t('editor.updating')}
            </span>
          </div>
          <CardCanvas
            template={template}
            senderName={senderName}
            recipientName={recipientName}
            message={message}
          />
        </aside>
      </div>
      {shareId && sharedCard ? (
        <ShareModal
          key={shareId}
          shareId={shareId}
          card={sharedCard}
          onClose={handleCloseShare}
        />
      ) : null}
    </main>
  )
}

export default Editor
