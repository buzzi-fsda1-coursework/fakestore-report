import { fetchAll } from "./api.ts"

const { products, carts, users } = await fetchAll()

console.log("prodotti", products)
console.log("carrelli", carts)
console.log("utenti", users)