import { PackageOpen, Pencil, Trash2 } from 'lucide-react'
import IconButton from './IconButton'

const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 2,
})

const stockStyles = {
  available: 'text-emerald-700 before:bg-emerald-600',
  low: 'text-amber-700 before:bg-amber-600',
  out: 'text-red-700 before:bg-red-600',
}

function getStockState(stock) {
  if (Number(stock) === 0) return { label: 'Agotado', className: 'out' }
  if (Number(stock) <= 5) return { label: 'Stock bajo', className: 'low' }
  return { label: 'Disponible', className: 'available' }
}

function LoadingRows() {
  return Array.from({ length: 4 }, (_, index) => (
    <tr key={index} aria-hidden="true">
      <td className="border-t border-slate-100 px-3.5 py-3.5 pl-5">
        <span className="block h-3 w-8 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="border-t border-slate-100 px-3.5 py-3.5">
        <span className="block h-3 w-40 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="border-t border-slate-100 px-3.5 py-3.5">
        <span className="block h-3 w-20 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="border-t border-slate-100 px-3.5 py-3.5">
        <span className="block h-3 w-16 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="border-t border-slate-100 px-3.5 py-3.5 pr-5">
        <span className="ml-auto block h-8 w-[70px] animate-pulse rounded bg-slate-200" />
      </td>
    </tr>
  ))
}

export default function ProductTable({ products, isLoading, onEdit, onDelete }) {
  if (!isLoading && products.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center border-t border-slate-200 px-5 py-11 text-center text-slate-400">
        <PackageOpen size={28} aria-hidden="true" />
        <h3 className="mt-3 mb-1 text-sm font-semibold text-slate-700">
          No hay productos para mostrar
        </h3>
        <p className="m-0 text-[11px] text-slate-500">
          Agrega un producto o cambia el término de búsqueda.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border-t border-slate-200">
      <table className="w-full min-w-[700px] border-collapse text-xs">
        <thead>
          <tr>
            <th className="bg-slate-50 px-3.5 py-3 pl-5 text-left text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              ID
            </th>
            <th className="bg-slate-50 px-3.5 py-3 text-left text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Producto
            </th>
            <th className="bg-slate-50 px-3.5 py-3 text-left text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Precio
            </th>
            <th className="bg-slate-50 px-3.5 py-3 text-left text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Inventario
            </th>
            <th className="bg-slate-50 px-3.5 py-3 pr-5 text-right text-[10px] font-semibold tracking-wide text-slate-500 uppercase">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <LoadingRows />
          ) : (
            products.map((product) => {
              const stockState = getStockState(product.stock)

              return (
                <tr className="hover:bg-slate-50/80" key={product.id}>
                  <td className="border-t border-slate-100 px-3.5 py-3.5 pl-5 align-middle">
                    <span className="font-mono text-[11px] text-slate-400">#{product.id}</span>
                  </td>
                  <td className="border-t border-slate-100 px-3.5 py-3.5 align-middle">
                    <strong className="block max-w-56 truncate font-semibold text-slate-800">
                      {product.nombre}
                    </strong>
                  </td>
                  <td className="border-t border-slate-100 px-3.5 py-3.5 align-middle font-medium whitespace-nowrap text-slate-700 tabular-nums">
                    {priceFormatter.format(Number(product.precio) || 0)}
                  </td>
                  <td className="border-t border-slate-100 px-3.5 py-3.5 align-middle">
                    <div className="flex flex-col items-start gap-1">
                      <strong className="text-[11px] font-semibold text-slate-700 tabular-nums">
                        {product.stock} uds.
                      </strong>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[9px] font-semibold before:block before:size-1.5 before:rounded-full before:content-[''] ${stockStyles[stockState.className]}`}
                      >
                        {stockState.label}
                      </span>
                    </div>
                  </td>
                  <td className="border-t border-slate-100 px-3.5 py-3.5 pr-5 align-middle">
                    <div className="flex justify-end gap-1.5">
                      <IconButton
                        label={`Editar ${product.nombre}`}
                        tooltip="Editar"
                        variant="edit"
                        size="sm"
                        onClick={() => onEdit(product)}
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </IconButton>
                      <IconButton
                        label={`Eliminar ${product.nombre}`}
                        tooltip="Eliminar"
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(product)}
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

