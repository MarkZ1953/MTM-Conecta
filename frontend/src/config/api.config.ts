/**
 * API_BASE_URL — base para todas las peticiones al backend.
 * En .env.local: VITE_API_URL=http://localhost:8000/api/v1
 * En producción: VITE_API_URL=https://tu-dominio.com/api/v1
 */
const API_BASE_URL: string = import.meta.env.VITE_API_URL ?? ''
const API_BASE_MEDIA_URL: string = import.meta.env.VITE_API_URL ?? ''

export default API_BASE_URL
export { API_BASE_MEDIA_URL }
