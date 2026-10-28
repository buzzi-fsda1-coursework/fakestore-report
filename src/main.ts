import { fetchAll } from "./api.ts"
import { buildProductIndex, getTopProducts } from "./reports.ts"

const { products, carts, users } = await fetchAll()

const productsById = buildProductIndex(products)
const topProducts = getTopProducts(carts, productsById)

console.log(JSON.stringify(topProducts, null, 2))
console.log("utenti", users)