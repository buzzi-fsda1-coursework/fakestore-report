import type { Cart, Product, ProductEntry } from "./types.ts"

type ProductSales = {
  product: Product
  units: number
}

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export function buildProductIndex(products: Product[]): Map<number, Product> {
  const productsById = new Map<number, Product>()

  for (const product of products) {
    productsById.set(product.id, product)
  }

  return productsById
}

function aggregateProducts(carts: Cart[], productsById: Map<number, Product>): ProductSales[] {
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

  return [...salesById.values()]
}

function rankProducts(sales: ProductSales[]): ProductEntry[] {
  return sales
    .map(({ product, units }) => ({
      productId: product.id,
      title: product.title,
      category: product.category,
      unitPrice: product.price,
      unitsSold: units,
      // una sola moltiplicazione sul totale, invece di sommare prezzo × quantità riga per riga
      revenue: product.price * units,
    }))
    .sort((a, b) => b.unitsSold - a.unitsSold || b.revenue - a.revenue || a.productId - b.productId)
    .slice(0, 3)
    // si arrotonda solo qui: ordinamento e confronti usano i valori pieni
    .map((entry, index) => ({
      rank: index + 1,
      ...entry,
      revenue: round2(entry.revenue),
    }))
}

export function getTopProducts(carts: Cart[], productsById: Map<number, Product>): ProductEntry[] {
  return rankProducts(aggregateProducts(carts, productsById))
}