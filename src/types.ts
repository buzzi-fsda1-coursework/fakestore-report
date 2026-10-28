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

export type ProductEntry = {
  rank: number
  productId: number
  title: string
  category: string
  unitPrice: number
  unitsSold: number
  revenue: number
}

export type CustomerEntry = {
  rank: number
  userId: number
  username: string | null
  fullName: string | null
  email: string | null
  orderCount: number
  itemsPurchased: number
  totalSpent: number
}

export type DateRange = {
  start: string
  end: string
}