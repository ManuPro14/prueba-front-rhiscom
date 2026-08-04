import { useEffect, useMemo, useState } from 'react'
import {
  Boxes,
  CircleDollarSign,
  Database,
  Package,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'
import ConfirmDialog from './components/ConfirmDialog'
import IconButton from './components/IconButton'
import ProductForm from './components/ProductForm'
import ProductTable from './components/ProductTable'
import StatusBanner from './components/StatusBanner'
import {
  createProduct,
  deleteProduct,
  listProducts,
  updateProduct,
} from './services/productApi'

const compactNumber = new Intl.NumberFormat('es-CO', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const currencyNumber = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const summaryItems = [
  { key: 'products', label: 'Productos', icon: Database },
  { key: 'units', label: 'Unidades', icon: Boxes },
  { key: 'value', label: 'Valor estimado', icon: CircleDollarSign },
]

export default function App() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productToDelete, setProductToDelete] = useState(null)
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [notice, setNotice] = useState(null)

  const loadProducts = async (refresh = false) => {
    if (refresh) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      const data = await listProducts()
      setProducts(data)
      if (refresh) {
        setNotice({ type: 'success', text: 'Inventario actualizado.' })
      }
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es')
    if (!normalizedQuery) return products

    return products.filter((product) =>
      String(product.nombre).toLocaleLowerCase('es').includes(normalizedQuery),
    )
  }, [products, query])

  const stats = useMemo(() => {
    const units = products.reduce(
      (total, product) => total + (Number(product.stock) || 0),
      0,
    )
    const value = products.reduce(
      (total, product) =>
        total + (Number(product.precio) || 0) * (Number(product.stock) || 0),
      0,
    )

    return {
      products: products.length,
      units: compactNumber.format(units),
      value: currencyNumber.format(value),
    }
  }, [products])

  const handleSubmit = async (values) => {
    setIsSaving(true)
    setNotice(null)

    try {
      const savedProduct = selectedProduct
        ? await updateProduct(selectedProduct.id, values)
        : await createProduct(values)

      if (savedProduct?.id) {
        setProducts((current) => {
          const exists = current.some((item) => item.id === savedProduct.id)
          return exists
            ? current.map((item) =>
                item.id === savedProduct.id ? savedProduct : item,
              )
            : [...current, savedProduct]
        })
      } else {
        await loadProducts()
      }

      setNotice({
        type: 'success',
        text: selectedProduct
          ? 'Producto actualizado correctamente.'
          : 'Producto registrado correctamente.',
      })
      setSelectedProduct(null)
      return true
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setNotice(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    setNotice(null)

    try {
      await deleteProduct(productToDelete.id)
      setProducts((current) =>
        current.filter((product) => product.id !== productToDelete.id),
      )
      if (selectedProduct?.id === productToDelete.id) setSelectedProduct(null)
      setNotice({ type: 'success', text: 'Producto eliminado correctamente.' })
      setProductToDelete(null)
    } catch (error) {
      setNotice({ type: 'error', text: error.message })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 items-center justify-between gap-6 px-5">
          <a
            className="inline-flex items-center gap-2.5 text-slate-900 no-underline"
            href="#main-content"
            aria-label="Ir al contenido"
          >
            <Package size={22} className="text-blue-600" aria-hidden="true" />
            <span className="text-base font-bold tracking-tight">Rhiscom</span>
          </a>
         
        </div>
      </header>

      <main id="main-content" className="mx-auto px-5">
        <section className="py-8 pb-6">
          <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
            Gestión de productos
          </h1>
          <p className="mt-1.5 mb-0 text-sm text-slate-500">
            Administra el catálogo y las existencias del inventario.
          </p>
        </section>

        <section
          className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3"
          aria-label="Resumen del inventario"
        >
          {summaryItems.map(({ key, label, icon: SummaryIcon }) => (
            <article
              key={key}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
                <SummaryIcon size={18} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <span className="mb-0.5 block text-[11px] text-slate-500">{label}</span>
                <strong className="block truncate text-lg font-semibold tabular-nums text-slate-900">
                  {stats[key]}
                </strong>
              </div>
            </article>
          ))}
        </section>

        <StatusBanner notice={notice} onClose={() => setNotice(null)} />

        <div className="grid items-start gap-5 pb-12 md:grid-cols-[340px_minmax(0,1fr)]">
          <ProductForm
            product={selectedProduct}
            isSaving={isSaving}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedProduct(null)}
          />

          <section
            className="min-w-0 rounded-xl border border-slate-200 bg-white"
            aria-labelledby="products-title"
          >
            <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4">
              <div>
                <h2 id="products-title" className="m-0 text-sm font-semibold text-slate-900">
                  Productos
                </h2>
                <p className="mt-1 mb-0 text-[11px] text-slate-500">
                  {filteredProducts.length} de {products.length}{' '}
                  {products.length === 1 ? 'registro' : 'registros'}
                </p>
              </div>
              <IconButton
                label="Actualizar listado"
                tooltip="Actualizar"
                onClick={() => loadProducts(true)}
                disabled={isLoading || isRefreshing}
              >
                <RefreshCw
                  size={17}
                  className={isRefreshing ? 'animate-spin' : undefined}
                  aria-hidden="true"
                />
              </IconButton>
            </div>

            <div className="relative mx-5 mb-4">
              <Search
                size={17}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <label className="sr-only" htmlFor="product-search">
                Buscar producto por nombre
              </label>
              <input
                id="product-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-10 pl-10 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
                placeholder="Buscar por nombre"
              />
              {query && (
                <button
                  type="button"
                  className="absolute top-1/2 right-2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-slate-500 hover:bg-slate-100"
                  onClick={() => setQuery('')}
                  aria-label="Limpiar búsqueda"
                  title="Limpiar búsqueda"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              )}
            </div>

            <ProductTable
              products={filteredProducts}
              isLoading={isLoading}
              onEdit={handleEdit}
              onDelete={setProductToDelete}
            />
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 px-5 py-5 text-center text-[10px] text-slate-400">
        Prueba técnica Fullstack - React/Spring Boot - Manuel Barrios
      </footer>

      <ConfirmDialog
        product={productToDelete}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => !isDeleting && setProductToDelete(null)}
      />
    </div>
  )
}

