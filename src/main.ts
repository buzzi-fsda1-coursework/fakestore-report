import { fetchAll } from "./api.ts"
import { getTopCustomers, getTopProducts, indexById } from "./reports.ts"

const { products, carts, users } = await fetchAll()

const productsById = indexById(products)
const usersById = indexById(users)

const topProducts = getTopProducts(carts, productsById)
const topCustomers = getTopCustomers(carts, productsById, usersById)

console.log(JSON.stringify(topProducts, null, 2))
console.log(JSON.stringify(topCustomers, null, 2))