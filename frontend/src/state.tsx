import { createContext, useContext, useEffect, useReducer } from 'react'
import { Product, fetchProducts, createProduct, deleteProduct } from './api'

type State = {
  products: Product[]
  loading: boolean
  error: string | null
}

type Action =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Product[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_SUCCESS'; payload: Product }
  | { type: 'DELETE_SUCCESS'; payload: number }

const initialState: State = { products: [], loading: false, error: null }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null }
    case 'LOAD_SUCCESS':
      return { ...state, loading: false, products: action.payload }
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'ADD_SUCCESS':
      return { ...state, products: [...state.products, action.payload] }
    case 'DELETE_SUCCESS':
      return { ...state, products: state.products.filter(p => p.id !== action.payload) }
    default:
      return state
  }
}

type Ctx = {
  state: State
  actions: {
    reload: () => Promise<void>
    add: (input: { name: string; description: string; price: number }) => Promise<void>
    remove: (id: number) => Promise<void>
  }
}

const ProductsContext = createContext<Ctx | undefined>(undefined)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function reload() {
    dispatch({ type: 'LOAD_START' })
    try {
      const data = await fetchProducts()
      dispatch({ type: 'LOAD_SUCCESS', payload: data })
    } catch (e: any) {
      dispatch({ type: 'LOAD_ERROR', payload: e?.message || 'Error' })
    }
  }

  async function add(input: { name: string; description: string; price: number }) {
    const created = await createProduct(input)
    dispatch({ type: 'ADD_SUCCESS', payload: created })
  }

  async function remove(id: number) {
    await deleteProduct(id)
    dispatch({ type: 'DELETE_SUCCESS', payload: id })
  }

  useEffect(() => { reload() }, [])

  return (
    <ProductsContext.Provider value={{ state, actions: { reload, add, remove } }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts debe usarse dentro de ProductsProvider')
  return ctx
}


