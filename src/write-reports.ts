import { mkdir, writeFile } from "node:fs/promises"
import { fetchAll } from "./api.ts"
import { buildCustomersReport, buildProductsReport, indexById } from "./reports.ts"

// relativa alla cartella da cui si lancia: con npm run è la radice del progetto
const OUTPUT_DIR = "reports"

try {
  const { products, carts, users } = await fetchAll()

  const productsById = indexById(products)
  const usersById = indexById(users)

  const productsJson = JSON.stringify(buildProductsReport(carts, productsById), null, 2)
  const customersJson = JSON.stringify(buildCustomersReport(carts, productsById, usersById), null, 2)

  await mkdir(OUTPUT_DIR, { recursive: true })
  await writeFile(`${OUTPUT_DIR}/top-products.json`, `${productsJson}\n`)
  await writeFile(`${OUTPUT_DIR}/top-customers.json`, `${customersJson}\n`)

  console.log(`Report scritti in ${OUTPUT_DIR}/`)
} catch (error) {
  const message = error instanceof Error ? error.message : String(error)

  console.error(`Errore: ${message}`)
  process.exitCode = 1
}
