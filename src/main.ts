type Product = {
  id: number
  title: string
  price: number
  category: string
}

type CartItem = {
  productId: number
  quantity: number
}

type Cart = {
  id: number
  userId: number
  date: string
  products: CartItem[]
}

type User = {
  id: number
  username: string
  email: string
  name: {
    firstname: string
    lastname: string
  }
}

const BASE_URL = "https://fakestoreapi.com"

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Richiesta fallita: ${response.status} ${url}`)
  }

  return (await response.json()) as T
}

const [products, carts, users] = await Promise.all([
  fetchJson<Product[]>(`${BASE_URL}/products`),
  fetchJson<Cart[]>(`${BASE_URL}/carts`),
  fetchJson<User[]>(`${BASE_URL}/users`),
])

console.log("prodotti", products)
console.log("carrelli", carts)
console.log("utenti", users)