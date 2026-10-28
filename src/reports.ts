import type { Cart, CustomerEntry, DateRange, Product, ProductEntry, Report, User } from "./types.ts"

type ProductSales = {
  product: Product
  units: number
}

type CustomerSpending = {
  userId: number
  orderCount: number
  itemsPurchased: number
  totalSpent: number
}

const DAY_MS = 24 * 60 * 60 * 1000

function round2(value: number): number {
  return Math.round(value * 100) / 100
}

export function indexById<T extends { id: number }>(items: T[]): Map<number, T> {
  const index = new Map<number, T>()

  for (const item of items) {
    index.set(item.id, item)
  }

  return index
}

function getAnchor(carts: Cart[]): number {
  if (carts.length === 0) {
    throw new Error("Nessun carrello nei dati: impossibile determinare la data di ancoraggio")
  }

  return Math.max(...carts.map((cart) => Date.parse(cart.date)))
}

function getLastMonthRange(anchor: number): DateRange {
  return {
    start: new Date(anchor - 30 * DAY_MS).toISOString(),
    end: new Date(anchor).toISOString(),
  }
}

function filterByRange(carts: Cart[], range: DateRange): Cart[] {
  const start = Date.parse(range.start)
  const end = Date.parse(range.end)

  return carts.filter((cart) => {
    const time = Date.parse(cart.date)
    return start <= time && time <= end
  })
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

function aggregateCustomers(carts: Cart[], productsById: Map<number, Product>): CustomerSpending[] {
  const spendingById = new Map<number, CustomerSpending>()

  for (const cart of carts) {
    let entry = spendingById.get(cart.userId)

    if (!entry) {
      entry = {
        userId: cart.userId,
        orderCount: 0,
        itemsPurchased: 0,
        totalSpent: 0,
      }
      spendingById.set(cart.userId, entry)
    }

    // il carrello è un ordine anche se alcune sue righe verranno ignorate
    entry.orderCount += 1

    for (const item of cart.products) {
      const product = productsById.get(item.productId)

      if (!product) {
        console.warn(`Prodotto ${item.productId} assente dal catalogo (carrello ${cart.id}): riga ignorata`)
        continue
      }

      entry.itemsPurchased += item.quantity
      entry.totalSpent += product.price * item.quantity
    }
  }

  return [...spendingById.values()]
}

function rankCustomers(spending: CustomerSpending[], usersById: Map<number, User>): CustomerEntry[] {
  return [...spending]
    .sort((a, b) => b.totalSpent - a.totalSpent || a.userId - b.userId)
    .slice(0, 3)
    .map((entry, index) => {
      const user = usersById.get(entry.userId)

      return {
        rank: index + 1,
        userId: entry.userId,
        username: user?.username ?? null,
        fullName: user ? `${user.name.firstname} ${user.name.lastname}` : null,
        email: user?.email ?? null,
        orderCount: entry.orderCount,
        itemsPurchased: entry.itemsPurchased,
        totalSpent: round2(entry.totalSpent),
      }
    })
}

function getTopProducts(carts: Cart[], productsById: Map<number, Product>): ProductEntry[] {
  return rankProducts(aggregateProducts(carts, productsById))
}

function getTopCustomers(
  carts: Cart[],
  productsById: Map<number, Product>,
  usersById: Map<number, User>,
): CustomerEntry[] {
  return rankCustomers(aggregateCustomers(carts, productsById), usersById)
}

function buildReport<T>(
  report: Report<T>["report"],
  carts: Cart[],
  rank: (carts: Cart[]) => T[],
): Report<T> {
  const anchor = getAnchor(carts)
  const range = getLastMonthRange(anchor)

  return {
    report,
    generatedAt: new Date().toISOString(),
    anchorDate: new Date(anchor).toISOString(),
    allTime: {
      range: null,
      ranking: rank(carts),
    },
    lastMonth: {
      range,
      ranking: rank(filterByRange(carts, range)),
    },
  }
}

export function buildProductsReport(carts: Cart[], productsById: Map<number, Product>): Report<ProductEntry> {
  return buildReport("top-products", carts, (periodCarts) => getTopProducts(periodCarts, productsById))
}

export function buildCustomersReport(
  carts: Cart[],
  productsById: Map<number, Product>,
  usersById: Map<number, User>,
): Report<CustomerEntry> {
  return buildReport("top-customers", carts, (periodCarts) => getTopCustomers(periodCarts, productsById, usersById))
}