import type { Cart, Product, StoreData, User } from "./types.ts"

const BASE_URL = "https://fakestoreapi.com"

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Richiesta fallita: ${response.status} ${url}`)
  }

  return (await response.json()) as T
}

export async function fetchAll(): Promise<StoreData> {
  const [products, carts, users] = await Promise.all([
    fetchJson<Product[]>(`${BASE_URL}/products`),
    fetchJson<Cart[]>(`${BASE_URL}/carts`),
    fetchJson<User[]>(`${BASE_URL}/users`),
  ])

  return { products, carts, users }
}