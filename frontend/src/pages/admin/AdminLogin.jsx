import { useState } from 'react'
import { Heart, LoaderCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth.js'

function AdminLogin() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setHasError(false)
    try {
      await login(email, password)
      const returnPath = location.state?.from?.pathname || '/admin'
      navigate(returnPath, { replace: true })
    } catch (error) {
      console.error('Unable to sign in to the admin panel.', error)
      setHasError(true)
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
          {t('admin.eyebrow')}
        </p>
        <h1 className="mt-2 font-display text-3xl text-slate-900 dark:text-white">
          {t('admin.loginTitle')}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {t('admin.loginDescription')}
        </p>

        {isLoading ? (
          <p role="status" className="mt-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
            {t('admin.loading')}
          </p>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {t('login.email')}
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                {t('login.password')}
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950"
              />
            </div>

            {hasError ? (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
                {t('admin.loginError')}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3.5 font-semibold text-white transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? <LoaderCircle size={18} className="animate-spin" aria-hidden="true" /> : null}
              {isSubmitting ? t('login.submitting') : t('admin.loginSubmit')}
            </button>
          </form>
        )}

        <Link
          to="/"
          className="mt-6 inline-flex text-sm font-medium text-slate-500 transition hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
        >
          {t('login.backHome')}
        </Link>
      </section>
    </main>
  )
}

export default AdminLogin
