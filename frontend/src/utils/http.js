export async function readBody(res) {
  const text = await res.text()
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return text ? JSON.parse(text) : null
    } catch {
      return null
    }
  }
  return text
}

export async function parseApiError(res, fallbackMessage) {
  const body = await readBody(res)
  if (body && typeof body === 'object') {
    return body.error?.message || body.error || body.message || fallbackMessage
  }
  if (typeof body === 'string' && body.trim()) {
    return `${fallbackMessage} (${res.status})`
  }
  return fallbackMessage
}

