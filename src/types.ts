export type Product = {
  id: number
  title: string
  price: number
  category: string
}

export type CartItem = {
  productId: number
  quantity: number
}

export type Cart = {
  id: number
  userId: number
  date: string
  products: CartItem[]
}

export type User = {
  id: number
  username: string
  email: string
  name: {
    firstname: string
    lastname: string
  }
}

export type StoreData = {
  products: Product[]
  carts: Cart[]
  users: User[]
}