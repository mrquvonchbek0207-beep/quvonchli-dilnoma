import { useState } from 'react'
import { Heart, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { getApiErrorMessage } from '../utils/apiError.js'

function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await login(email, password)
      navigate('/')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, t('login.error')))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center justify-center px-4 py-12 sm:px-6">
      <section className="w-full max-w-md rounded-3xl border border-rose-100 bg-white p-7 shadow-xl shadow-rose-900/5 sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-7 grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
          <Heart size={23} fill="currentColor" aria-hidden="true" />
        </div>
        <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">{t('login.eyebrow')}</p>
        <h1 className="mt-2 font-display text-3xl text-slate-900 dark:text-white">{t('login.title')}</h1>

        <nav
          aria-label={t('login.accountNavigation')}
          className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
        >
          <Link
            to="/login"
            aria-current="page"
            className="rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-rose-700 shadow-sm dark:bg-slate-700 dark:text-rose-200"
          >
            {t('login.submit')}
          </Link>
          <Link
            to="/register"
            className="rounded-lg px-3 py-2 text-center text-sm font-medium text-slate-600 transition hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-200"
          >
            {t('login.registerLink')}
          </Link>
        </nav>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('login.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('login.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
            />
          </div>

          {errorMessage ? (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3.5 font-semibold text-white transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : null}
            {isSubmitting ? t('login.submitting') : t('login.submit')}
          </button>
        </form>

        <div className="mt-6 flex justify-end text-sm">
          <Link to="/" className="font-medium text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300">
            {t('login.backHome')}
          </Link>
        </div>
      </section>
    </main>
  )
}

export default Login
