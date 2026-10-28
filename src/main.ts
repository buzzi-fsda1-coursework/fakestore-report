import { fetchAll } from "./api.ts"
import {
  filterByRange,
  getAnchor,
  getLastMonthRange,
  getTopCustomers,
  getTopProducts,
  indexById,
} from "./reports.ts"

const { products, carts, users } = await fetchAll()

const productsById = indexById(products)
const usersById = indexById(users)

const anchor = getAnchor(carts)
const lastMonthRange = getLastMonthRange(anchor)
const lastMonthCarts = filterByRange(carts, lastMonthRange)

console.log("ancoraggio", new Date(anchor).toISOString())
console.log("intervallo ultimo mese", lastMonthRange)
console.log("carrelli totali", carts.length, "nell'ultimo mese", lastMonthCarts.length)

console.log("prodotti all time", JSON.stringify(getTopProducts(carts, productsById), null, 2))
console.log("prodotti ultimo mese", JSON.stringify(getTopProducts(lastMonthCarts, productsById), null, 2))
console.log("clienti all time", JSON.stringify(getTopCustomers(carts, productsById, usersById), null, 2))
console.log("clienti ultimo mese", JSON.stringify(getTopCustomers(lastMonthCarts, productsById, usersById), null, 2))