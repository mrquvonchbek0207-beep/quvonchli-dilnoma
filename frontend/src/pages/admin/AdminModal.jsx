import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function AdminModal({ title, onClose, children }) {
  const { t } = useTranslation()
  const titleId = 'admin-modal-title'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-3xl border border-rose-100 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 id={titleId} className="font-display text-2xl text-slate-900 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            aria-label={t('admin.close')}
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-200"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

export default AdminModal
