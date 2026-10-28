type Product = {
  id: number
  title: string
  price: number
  category: string
}

const url = "https://fakestoreapi.com/products"

const response = await fetch(url)

if (!response.ok) {
  throw new Error(`Richiesta fallita: ${response.status} ${url}`)
}

const products = (await response.json()) as Product[]

console.log(products)