import { supabase } from '../lib/supabase'

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Sold Out'

export type Product = {
  id: string
  name: string
  price: number
  category: 'Bags' | 'Wallets' | 'Jackets' | 'Accessories'
  description: string
  colours: string[]
  sizes: string[]
  stock: StockStatus
  featured: boolean
  published: boolean
  images: string[]
}

const BUCKET = 'product-images'
const notify = () => window.dispatchEvent(new Event('products-updated'))

function fail(error: unknown) {
  console.error(error)
  alert('Something went wrong. Please check your internet connection and try again.')
  return false
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rowToProduct = (r: any): Product => ({
  id: r.id,
  name: r.name,
  price: Number(r.price),
  category: r.category,
  description: r.description ?? '',
  colours: r.colours ?? [],
  sizes: r.sizes ?? [],
  stock: r.stock,
  featured: !!r.featured,
  published: !!r.published,
  images: r.images ?? [],
})

export async function getProducts(includeDrafts = false): Promise<Product[]> {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false })
  if (!includeDrafts) query = query.eq('published', true)
  const { data, error } = await query
  if (error) { console.error(error); return [] }
  return (data ?? []).map(rowToProduct)
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle()
  if (error) { console.error(error); return undefined }
  return data ? rowToProduct(data) : undefined
}

export async function addProduct(product: Product): Promise<boolean> {
  const { error } = await supabase.from('products').insert(product)
  if (error) return fail(error)
  notify()
  return true
}

export async function updateProduct(id: string, changes: Partial<Product>): Promise<boolean> {
  const { error } = await supabase.from('products').update(changes).eq('id', id)
  if (error) return fail(error)
  notify()
  return true
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return fail(error)
  notify()
  return true
}

export async function duplicateProduct(id: string): Promise<boolean> {
  const p = await getProduct(id)
  if (!p) return false
  return addProduct({ ...p, id: `${p.id}-copy-${Date.now()}`, name: `${p.name} (copy)`, published: false })
}

// Shrinks big phone photos to about 1400px so the site stays fast
async function compress(file: File, maxSize = 1400, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process photo'))), 'image/jpeg', quality),
  )
}

// Uploads one photo and returns its public web address
export async function uploadImage(file: File): Promise<string> {
  const blob = await compress(file)
  const path = `${crypto.randomUUID()}.jpg`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: 'image/jpeg',
    cacheControl: '31536000',
  })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}