import { useEffect, useState } from 'react'
import { ImagePlus, LoaderCircle, Plus, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { createLocalTemplate, fetchCategories, fetchAllTemplates } from '../../services/api.js'
import AdminModal from './AdminModal.jsx'

const fieldClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-rose-950'
const labelClass = 'mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200'

const emptyTemplate = {
  category_id: '',
  name_uz: '',
  name_ru: '',
  name_en: '',
  preview_img: '',
}

function getLocalizedName(template, language) {
  return template[`name_${language}`] || template.name_en || template.name_uz
}

function AdminTemplates() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState([])
  const [templates, setTemplates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState(emptyTemplate)
  const [uploadName, setUploadName] = useState('')
  const [formError, setFormError] = useState(false)
  const [savedNotice, setSavedNotice] = useState(false)
  const language = (i18n.resolvedLanguage || i18n.language).split('-')[0]

  useEffect(() => {
    let active = true

    async function loadTemplates() {
      try {
        const loadedCategories = await fetchCategories()
        const loadedTemplates = await fetchAllTemplates(loadedCategories)
        if (active) {
          setCategories(loadedCategories)
          setTemplates(loadedTemplates)
          setHasError(false)
        }
      } catch (error) {
        console.error('Unable to load admin templates.', error)
        if (active) setHasError(true)
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadTemplates()
    return () => {
      active = false
    }
  }, [retry])

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFormError(false)
  }

  function closeModal() {
    setIsModalOpen(false)
    setForm(emptyTemplate)
    setUploadName('')
    setFormError(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    setFormError(false)
    setSavedNotice(false)
    try {
      const newTemplate = createLocalTemplate({
        ...form,
        category_id: Number(form.category_id),
        style_config: {},
        preview_img: form.preview_img.trim() || null,
      })
      setTemplates((current) => [...current, newTemplate])
      setSavedNotice(true)
      closeModal()
    } catch (error) {
      console.error('Unable to save the local template.', error)
      setFormError(true)
    }
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find((item) => String(item.id) === String(categoryId))
    return category
      ? category[`name_${language}`] || category.name_en || category.name_uz
      : t('admin.unknownCategory')
  }

  return (
    <main>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">
            {t('admin.nav.templates')}
          </p>
          <h2 className="mt-2 font-display text-3xl text-slate-900 dark:text-white">
            {t('admin.templatesTitle')}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {t('admin.templatesDescription')}
          </p>
        </div>
        <button
          type="button"
          disabled={isLoading || hasError || categories.length === 0}
          onClick={() => setIsModalOpen(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={18} aria-hidden="true" />
          {t('admin.addTemplate')}
        </button>
      </div>

      {savedNotice ? (
        <p role="status" className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
          {t('admin.savedLocally')}
        </p>
      ) : null}

      {isLoading ? (
        <div role="status" className="mt-8 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <LoaderCircle size={19} className="animate-spin" aria-hidden="true" />
          {t('admin.loading')}
        </div>
      ) : hasError ? (
        <div role="alert" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          <p>{t('admin.loadError')}</p>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true)
              setRetry((attempt) => attempt + 1)
            }}
            className="mt-3 rounded-lg bg-white px-3 py-2 font-semibold dark:bg-slate-900"
          >
            {t('admin.retry')}
          </button>
        </div>
      ) : (
        <div className="mt-7 overflow-hidden rounded-2xl border border-rose-100 bg-white dark:border-slate-800 dark:bg-slate-900">
          {templates.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Sparkles size={25} className="mx-auto text-rose-500" aria-hidden="true" />
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {t('admin.emptyTemplates')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-rose-50/80 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                  <tr>
                    <th scope="col" className="px-5 py-4">{t('admin.template')}</th>
                    <th scope="col" className="px-5 py-4">{t('admin.category')}</th>
                    <th scope="col" className="px-5 py-4">{t('admin.languages')}</th>
                    <th scope="col" className="px-5 py-4">{t('admin.source')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100 dark:divide-slate-800">
                  {templates.map((template) => (
                    <tr key={template.id}>
                      <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-rose-50 text-rose-500 dark:bg-slate-800 dark:text-rose-300">
                            {template.preview_img ? (
                              <img src={template.preview_img} alt="" className="h-full w-full object-cover" />
                            ) : (
                              <ImagePlus size={18} aria-hidden="true" />
                            )}
                          </span>
                          <span>{getLocalizedName(template, language)}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-slate-600 dark:text-slate-300">
                        {getCategoryName(template.category_id)}
                      </td>
                      <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                        {template.name_uz} · {template.name_ru} · {template.name_en}
                      </td>
                      <td className="px-5 py-4">
                        {template.localOnly ? (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                            {t('admin.local')}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {t('admin.backend')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {isModalOpen ? (
        <AdminModal title={t('admin.addTemplate')} onClose={closeModal}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="template-category" className={labelClass}>{t('admin.category')}</label>
              <select
                id="template-category"
                name="category_id"
                required
                value={form.category_id}
                onChange={updateForm}
                className={fieldClass}
              >
                <option value="">{t('admin.selectCategory')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name_en}
                  </option>
                ))}
              </select>
            </div>

            {['uz', 'ru', 'en'].map((languageCode) => (
              <div key={languageCode}>
                <label htmlFor={`template-name-${languageCode}`} className={labelClass}>
                  {t(`admin.title${languageCode.toUpperCase()}`)}
                </label>
                <input
                  id={`template-name-${languageCode}`}
                  name={`name_${languageCode}`}
                  required
                  maxLength={150}
                  value={form[`name_${languageCode}`]}
                  onChange={updateForm}
                  className={fieldClass}
                />
              </div>
            ))}

            <div>
              <label htmlFor="template-image-url" className={labelClass}>{t('admin.imageUrl')}</label>
              <input
                id="template-image-url"
                name="preview_img"
                type="url"
                value={form.preview_img}
                onChange={updateForm}
                placeholder="https://example.com/card.jpg"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="template-image-upload" className={labelClass}>{t('admin.imageUpload')}</label>
              <input
                id="template-image-upload"
                type="file"
                accept="image/*"
                onChange={(event) => setUploadName(event.target.files?.[0]?.name || '')}
                className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:font-semibold file:text-rose-700 hover:file:bg-rose-100 dark:text-slate-300 dark:file:bg-slate-800 dark:file:text-rose-200"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                {uploadName || t('admin.imageUploadNote')}
              </p>
            </div>

            {formError ? (
              <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-200">
                {t('admin.saveError')}
              </p>
            ) : null}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200"
              >
                {t('admin.cancel')}
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700"
              >
                <Plus size={17} aria-hidden="true" />
                {t('admin.saveTemplate')}
              </button>
            </div>
          </form>
        </AdminModal>
      ) : null}
    </main>
  )
}

export default AdminTemplates
