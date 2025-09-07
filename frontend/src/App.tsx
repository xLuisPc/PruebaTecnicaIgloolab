import ProductForm from './components/ProductForm'
import ProductList from './components/ProductList'
import { ProductsProvider } from './state'

export default function App() {
  return (
    <div className="container grid">
      <h1 className="title">Productos</h1>
      <ProductsProvider>
        <ProductForm />
        <ProductList />
      </ProductsProvider>
    </div>
  )
}


