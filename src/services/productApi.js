const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(
  /\/$/,
  '',
)

const PRODUCTS_PATH = import.meta.env.VITE_PRODUCTS_PATH || '/productos'
const API_STYLE = import.meta.env.VITE_API_STYLE || 'document'

export class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError(
      'No fue posible conectar con el backend. Verifica que Spring Boot esté ejecutándose en el puerto 8080.',
      0,
    )
  }

  const contentType = response.headers.get('content-type') || ''
  const hasJson = contentType.includes('application/json')
  const data = response.status === 204 ? null : hasJson ? await response.json() : null

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `La solicitud no pudo completarse (HTTP ${response.status}).`

    throw new ApiError(message, response.status, data?.errors || null)
  }

  return data
}

export async function listProducts() {
  const data = await request(PRODUCTS_PATH)

  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  if (Array.isArray(data?.products)) return data.products

  return []
}

export function createProduct(product) {
  return request(PRODUCTS_PATH, {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

export function updateProduct(id, product) {
  if (API_STYLE === 'rest') {
    return request(`${PRODUCTS_PATH}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    })
  }

  return request(PRODUCTS_PATH, {
    method: 'POST',
    body: JSON.stringify({ id, ...product }),
  })
}

export function deleteProduct(id) {
  return request(`${PRODUCTS_PATH}/${id}`, {
    method: API_STYLE === 'rest' ? 'DELETE' : 'POST',
  })
}

