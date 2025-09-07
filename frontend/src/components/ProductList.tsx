import { useProducts } from '../state'

export default function ProductList() {
  const { state, actions } = useProducts()

  if (state.loading) return <p>Cargando productos...</p>
  if (state.error) return <p style={{ color: 'crimson' }}>{state.error}</p>

  return (
    <div className="card">
      <h2 className="title">Productos</h2>
      {state.products.length === 0 && <p className="muted">No hay productos</p>}
      <ul className="list">
        {state.products.map(p => (
          <li key={p.id} className="row card">
            <div style={{ display: 'grid', gap: 4 }}>
              <div className="name">{p.name}</div>
              <div className="muted">{p.description}</div>
              <div className="price">Precio: ${p.price.toFixed(2)}</div>
            </div>
            <button onClick={() => actions.remove(p.id)} className="btn-danger">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}


