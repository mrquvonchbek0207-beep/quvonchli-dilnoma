import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'joyful-dilnoma-token'
export const API_SLOW_REQUEST_EVENT = 'joyful-dilnoma:slow-request'
const LOCAL_TEMPLATES_KEY = 'joyful-dilnoma-admin-templates'
const LOCAL_QUOTES_KEY = 'joyful-dilnoma-admin-quotes'
const SLOW_REQUEST_DELAY_MS = 4000
const activeSlowRequestIds = new Set()
let nextRequestId = 0
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

function notifySlowRequestChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(API_SLOW_REQUEST_EVENT, {
        detail: { activeCount: activeSlowRequestIds.size },
      }),
    )
  }
}

function finishRequest(config) {
  if (!config) return

  if (typeof window !== 'undefined') {
    window.clearTimeout(config.__joyfulSlowRequestTimer)
  }
  if (activeSlowRequestIds.delete(config.__joyfulSlowRequestId)) {
    notifySlowRequestChange()
  }
}

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const requestId = ++nextRequestId
    config.__joyfulSlowRequestId = requestId
    config.__joyfulSlowRequestTimer = window.setTimeout(() => {
      activeSlowRequestIds.add(requestId)
      notifySlowRequestChange()
    }, SLOW_REQUEST_DELAY_MS)
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    finishRequest(response.config)
    return response
  },
  (error) => {
    finishRequest(error.config)
    return Promise.reject(error)
  },
)

export async function fetchCategories() {
  const response = await api.get('/api/categories')
  return response.data
}

export async function fetchTemplatesByCategory(categoryId) {
  const response = await api.get(`/api/categories/${categoryId}/templates`)
  const localTemplates = readLocalItems(LOCAL_TEMPLATES_KEY).filter(
    (template) => String(template.category_id) === String(categoryId),
  )
  return [...response.data, ...localTemplates]
}

export async function fetchQuotesByCategory(categoryId) {
  const response = await api.get(`/api/categories/${categoryId}/quotes`)
  const localQuotes = readLocalItems(LOCAL_QUOTES_KEY).filter(
    (quote) => String(quote.category_id) === String(categoryId),
  )
  return [...response.data, ...localQuotes]
}

export async function fetchAllTemplates(categories) {
  const templatesByCategory = await Promise.all(
    categories.map((category) => fetchTemplatesByCategory(category.id)),
  )
  return templatesByCategory.flat()
}

export async function fetchAllQuotes(categories) {
  const quotesByCategory = await Promise.all(
    categories.map((category) =>
      fetchQuotesByCategory(category.id),
    ),
  )
  return quotesByCategory.flat()
}

function readLocalItems(storageKey) {
  const storedItems = window.localStorage.getItem(storageKey)
  if (!storedItems) return []

  const items = JSON.parse(storedItems)
  if (!Array.isArray(items)) {
    throw new Error(`Expected ${storageKey} to contain a JSON array.`)
  }
  return items
}

function saveLocalItem(storageKey, item) {
  const savedItem = {
    ...item,
    id: `local-${crypto.randomUUID()}`,
    localOnly: true,
  }
  window.localStorage.setItem(
    storageKey,
    JSON.stringify([...readLocalItems(storageKey), savedItem]),
  )
  return savedItem
}

export function createLocalTemplate(template) {
  return saveLocalItem(LOCAL_TEMPLATES_KEY, template)
}

export function createLocalQuote(quote) {
  return saveLocalItem(LOCAL_QUOTES_KEY, quote)
}

export default api
