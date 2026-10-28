import { fetchAll } from "./api.ts"
import { buildProductIndex, buildUserIndex, getTopCustomers, getTopProducts } from "./reports.ts"

const { products, carts, users } = await fetchAll()

const productsById = buildProductIndex(products)
const usersById = buildUserIndex(users)

const topProducts = getTopProducts(carts, productsById)
const topCustomers = getTopCustomers(carts, productsById, usersById)

console.log(JSON.stringify(topProducts, null, 2))
console.log(JSON.stringify(topCustomers, null, 2))