import axios from 'axios'

export const TOKEN_STORAGE_KEY = 'joyful-dilnoma-token'
const LOCAL_TEMPLATES_KEY = 'joyful-dilnoma-admin-templates'
const LOCAL_QUOTES_KEY = 'joyful-dilnoma-admin-quotes'
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
