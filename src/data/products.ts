export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Sold Out'

export type Product = {
  id: string
  name: string
  price: number
  category: 'Bags' | 'Wallets' | 'Belts' | 'Accessories'
  description: string
  colours: string[]
  sizes: string[]
  stock: StockStatus
  featured: boolean
  published: boolean
  images: string[]
}

const images = {
  bag: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85',
  tote: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85',
  wallet: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=85',
  belt: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=900&q=85',
  satchel: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85',
  purse: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
  journal: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85',
  keyring: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=85',
}

export const seedProducts: Product[] = [
  { id: 'classic-satchel', name: 'Classic Leather Satchel', price: 1890, category: 'Bags', description: 'A timeless everyday satchel, handmade from full-grain leather with strong brass fittings.', colours: ['Tan', 'Chocolate', 'Black'], sizes: ['Standard'], stock: 'In Stock', featured: true, published: true, images: [images.satchel, images.bag] },
  { id: 'parys-tote', name: 'Parys Everyday Tote', price: 1490, category: 'Bags', description: 'Roomy, comfortable and built for every day. Includes a secure inner pocket.', colours: ['Tan', 'Brown'], sizes: ['Medium', 'Large'], stock: 'Low Stock', featured: true, published: true, images: [images.tote, images.purse] },
  { id: 'slim-wallet', name: 'Slim Card Wallet', price: 390, category: 'Wallets', description: 'A neat pocket wallet with room for cards and folded notes.', colours: ['Tan', 'Black', 'Brown'], sizes: ['One size'], stock: 'In Stock', featured: true, published: true, images: [images.wallet] },
  { id: 'heritage-belt', name: 'Heritage Leather Belt', price: 620, category: 'Belts', description: 'A sturdy leather belt with a classic buckle, made to last.', colours: ['Tan', 'Dark brown', 'Black'], sizes: ['S', 'M', 'L', 'XL'], stock: 'In Stock', featured: true, published: true, images: [images.belt] },
  { id: 'zip-wallet', name: 'Zip Around Wallet', price: 790, category: 'Wallets', description: 'A spacious zip wallet that keeps cards, notes and coins together.', colours: ['Tan', 'Red', 'Black'], sizes: ['One size'], stock: 'Low Stock', featured: false, published: true, images: [images.purse] },
  { id: 'traveller-bag', name: 'Weekend Traveller', price: 2590, category: 'Bags', description: 'A generous weekend bag with comfortable handles and a removable shoulder strap.', colours: ['Tan', 'Chocolate'], sizes: ['Standard'], stock: 'Out of Stock', featured: false, published: true, images: [images.bag] },
  { id: 'journal-cover', name: 'Leather Journal Cover', price: 540, category: 'Accessories', description: 'A refillable leather cover for your notes, lists and memories.', colours: ['Tan', 'Brown'], sizes: ['A5'], stock: 'In Stock', featured: false, published: true, images: [images.journal] },
  { id: 'key-holder', name: 'Loop Key Holder', price: 180, category: 'Accessories', description: 'A simple, strong leather key loop with a brass ring.', colours: ['Tan', 'Brown', 'Black'], sizes: ['One size'], stock: 'In Stock', featured: false, published: true, images: [images.keyring] },
  { id: 'mini-crossbody', name: 'Mini Crossbody Bag', price: 1190, category: 'Bags', description: 'A compact hands-free bag for your phone, wallet and daily essentials.', colours: ['Tan', 'Black'], sizes: ['Standard'], stock: 'Sold Out', featured: false, published: true, images: [images.purse] },
]

const KEY = 'charming-leather-products-v1'

export function getProducts(includeDrafts = false): Product[] {
  const saved = localStorage.getItem(KEY)
  const products = saved ? (JSON.parse(saved) as Product[]) : seedProducts
  return includeDrafts ? products : products.filter((product) => product.published)
}

function save(products: Product[]) {
  localStorage.setItem(KEY, JSON.stringify(products))
  window.dispatchEvent(new Event('products-updated'))
}

export function getProduct(id: string) {
  return getProducts(true).find((product) => product.id === id)
}

export function addProduct(product: Product) {
  save([product, ...getProducts(true)])
}

export function updateProduct(id: string, updates: Partial<Product>) {
  save(getProducts(true).map((product) => (product.id === id ? { ...product, ...updates } : product)))
}

export function deleteProduct(id: string) {
  save(getProducts(true).filter((product) => product.id !== id))
}

export function duplicateProduct(id: string) {
  const source = getProduct(id)
  if (!source) return
  addProduct({ ...source, id: `${source.id}-copy-${Date.now()}`, name: `${source.name} (Copy)`, published: false })
}
