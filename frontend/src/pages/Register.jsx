import { useState } from 'react'
import { Heart, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth.js'
import { getApiErrorMessage } from '../utils/apiError.js'

function Register() {
  const { t } = useTranslation()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await register(fullName.trim(), email, password)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('Unable to register and sign in.', error)
      setErrorMessage(getApiErrorMessage(error, t('register.error')))
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
        <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
          {t('register.eyebrow')}
        </p>
        <h1 className="mt-2 font-display text-3xl text-slate-900 dark:text-white">
          {t('register.title')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {t('register.description')}
        </p>

        <nav
          aria-label={t('login.accountNavigation')}
          className="mt-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1 dark:bg-slate-800"
        >
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 text-center text-sm font-medium text-slate-600 transition hover:text-rose-700 dark:text-slate-300 dark:hover:text-rose-200"
          >
            {t('register.signIn')}
          </Link>
          <Link
            to="/register"
            aria-current="page"
            className="rounded-lg bg-white px-3 py-2 text-center text-sm font-semibold text-rose-700 shadow-sm dark:bg-slate-700 dark:text-rose-200"
          >
            {t('login.registerLink')}
          </Link>
        </nav>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="register-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('register.fullName')}
            </label>
            <input
              id="register-name"
              name="full_name"
              type="text"
              autoComplete="name"
              maxLength={150}
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
            />
          </div>
          <div>
            <label htmlFor="register-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('login.email')}
            </label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
            />
          </div>
          <div>
            <label htmlFor="register-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              {t('login.password')}
            </label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
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
            {isSubmitting ? t('register.submitting') : t('register.submit')}
          </button>
        </form>

      </section>
    </main>
  )
}

export default Register
