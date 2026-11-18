const SHARED_CARD_STORAGE_PREFIX = 'joyful-dilnoma-shared-card:'

export function createShareId() {
  const identifier =
    globalThis.crypto?.randomUUID?.().replace(/-/g, '') ||
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
  return `demo${identifier.slice(0, 12)}`
}

export function saveSharedCard(card) {
  window.localStorage.setItem(
    `${SHARED_CARD_STORAGE_PREFIX}${card.id}`,
    JSON.stringify(card),
  )
}

export function loadSharedCard(id) {
  const storedCard = window.localStorage.getItem(
    `${SHARED_CARD_STORAGE_PREFIX}${id}`,
  )
  if (!storedCard) {
    return null
  }

  try {
    const card = JSON.parse(storedCard)
    if (
      typeof card !== 'object' ||
      card === null ||
      card.id !== id ||
      !card.template
    ) {
      console.warn(`Ignoring invalid locally saved card "${id}".`)
      return null
    }
    return card
  } catch (error) {
    console.error(`Unable to read locally saved card "${id}".`, error)
    return null
  }
}
