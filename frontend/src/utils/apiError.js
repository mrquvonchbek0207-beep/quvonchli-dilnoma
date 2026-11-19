export function getApiErrorMessage(error, fallback) {
  const detail = error?.response?.data?.detail
  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item?.msg !== 'string') return null
        const location = Array.isArray(item.loc) ? item.loc.at(-1) : null
        return location ? `${location}: ${item.msg}` : item.msg
      })
      .filter(Boolean)

    if (messages.length > 0) return messages.join('; ')
  }

  return fallback
}
