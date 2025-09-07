const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:4000'

export type Product = {
  id: number
  name: string
  description: string
  price: number
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`)
  if (!res.ok) throw new Error('Error al obtener productos')
  const data = await res.json()
  return (data as any[]).map((p) => ({
    ...p,
    price: typeof p.price === 'string' ? parseFloat(p.price) : p.price
  }))
}

export async function createProduct(input: {
  name: string
  description: string
  price: number
}): Promise<Product> {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  })
  if (!res.ok) {
    const msg = await res.json().catch(() => ({ error: 'Error' }))
    throw new Error(msg.error || 'Error al crear producto')
  }
  const created = await res.json()
  return {
    ...created,
    price: typeof created.price === 'string' ? parseFloat(created.price) : created.price
  }
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar producto')
}


