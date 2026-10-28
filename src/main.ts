import { fetchAll } from "./api.ts"
import { buildProductIndex, getTopProducts } from "./reports.ts"

const { products, carts, users } = await fetchAll()

const productsById = buildProductIndex(products)
const topProducts = getTopProducts(carts, productsById)

console.table(topProducts)
console.log("utenti", users)