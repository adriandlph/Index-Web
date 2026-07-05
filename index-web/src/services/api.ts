import type { ApiResponse } from '../types.ts'
import { API_BASE } from '../config/api.ts'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  }
  const body: ApiResponse<T> = await res.json()
  if (body.code !== 0) {
    throw new Error(body.message)
  }
  return body.data
}

export async function fetchApi<T>(path: string): Promise<T> {
  return request<T>(path)
}

export async function postApi<T>(path: string, data: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(data) })
}

export async function putApi<T>(path: string, data: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(data) })
}

export async function deleteApi(path: string): Promise<void> {
  await request<void>(path, { method: 'DELETE' })
}
