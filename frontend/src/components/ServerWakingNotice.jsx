import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { API_SLOW_REQUEST_EVENT } from '../services/api.js'

function ServerWakingNotice() {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function handleSlowRequest(event) {
      setIsVisible(event.detail.activeCount > 0)
    }

    window.addEventListener(API_SLOW_REQUEST_EVENT, handleSlowRequest)
    return () => window.removeEventListener(API_SLOW_REQUEST_EVENT, handleSlowRequest)
  }, [])

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[60] px-4">
      <p
        role="status"
        aria-live="polite"
        className="mx-auto w-fit max-w-xl rounded-full border border-amber-200 bg-amber-50 px-5 py-3 text-center text-sm font-medium text-amber-900 shadow-lg dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
      >
        {t('common.serverWaking')}
      </p>
    </div>
  )
}

export default ServerWakingNotice
