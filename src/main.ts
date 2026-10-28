import { fetchAll } from "./api.ts"
import { buildCustomersReport, buildProductsReport, indexById } from "./reports.ts"

const { products, carts, users } = await fetchAll()

const productsById = indexById(products)
const usersById = indexById(users)

const productsReport = buildProductsReport(carts, productsById)
const customersReport = buildCustomersReport(carts, productsById, usersById)

console.log(JSON.stringify(productsReport, null, 2))
console.log(JSON.stringify(customersReport, null, 2))