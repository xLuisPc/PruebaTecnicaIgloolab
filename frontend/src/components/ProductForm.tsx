import { useState } from 'react'
import { useProducts } from '../state'

export default function ProductForm() {
  const { actions } = useProducts()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [error, setError] = useState<string | null>(null)

  function validate(): string | null {
    const n = name.trim()
    const d = description.trim()
    const p = parseFloat(price)
    if (!n || !d || price === '') return 'Todos los campos son obligatorios'
    if (Number.isNaN(p)) return 'El precio debe ser numérico'
    if (p <= 0) return 'El precio debe ser mayor que 0'
    if (n.length > 255) return 'El nombre no puede exceder 255 caracteres'
    return null
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const msg = validate()
    if (msg) { setError(msg); return }
    setError(null)
    await actions.add({ name: name.trim(), description: description.trim(), price: parseFloat(price) })
    setName('')
    setDescription('')
    setPrice('')
  }

  return (
    <form onSubmit={onSubmit} className="card grid" style={{ maxWidth: 520 }}>
      <h2 className="title">Agregar producto</h2>
      {error && <div style={{ color: 'var(--danger)' }}>{error}</div>}
      <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
      <textarea placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Precio" value={price} onChange={e => setPrice(e.target.value)} />
      <div>
        <button type="submit" className="btn">Crear</button>
      </div>
    </form>
  )
}


