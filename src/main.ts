import { fetchAll } from "./api.ts"
import type { Product } from "./types.ts"

type ProductSales = {
  product: Product
  units: number
}

const { products, carts, users } = await fetchAll()

const productsById = new Map<number, Product>()

for (const product of products) {
  productsById.set(product.id, product)
}

const salesById = new Map<number, ProductSales>()

for (const cart of carts) {
  for (const item of cart.products) {
    const product = productsById.get(item.productId)

    if (!product) {
      console.warn(`Prodotto ${item.productId} assente dal catalogo (carrello ${cart.id}): riga ignorata`)
      continue
    }

    const entry = salesById.get(product.id)

    if (entry) {
      entry.units += item.quantity
    } else {
      salesById.set(product.id, { product, units: item.quantity })
    }
  }
}

const sales = [...salesById.values()].map(({ product, units }) => ({
  id: product.id,
  title: product.title,
  category: product.category,
  price: product.price,
  unitsSold: units,
  // una sola moltiplicazione sul totale, invece di sommare prezzo × quantità riga per riga
  revenue: product.price * units,
}))

console.table(sales)
console.log("utenti", users)