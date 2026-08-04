import { LoaderCircle, PackagePlus, Pencil, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import IconButton from './IconButton'

const EMPTY_FORM = {
  nombre: '',
  precio: '',
  stock: '',
}

const inputBaseClass =
  'h-10 w-full rounded-lg border bg-white px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:ring-3'

function validate(values) {
  const errors = {}
  const price = Number(values.precio)
  const stock = Number(values.stock)

  if (!values.nombre.trim()) {
    errors.nombre = 'Ingresa el nombre del producto.'
  } else if (values.nombre.trim().length > 100) {
    errors.nombre = 'El nombre no puede superar 100 caracteres.'
  }

  if (values.precio === '') {
    errors.precio = 'Ingresa el precio.'
  } else if (!Number.isFinite(price) || price < 0) {
    errors.precio = 'El precio debe ser mayor o igual a cero.'
  }

  if (values.stock === '') {
    errors.stock = 'Ingresa la cantidad disponible.'
  } else if (!Number.isInteger(stock) || stock < 0) {
    errors.stock = 'El stock debe ser un entero mayor o igual a cero.'
  }

  return errors
}

function getInputClassName(hasError) {
  return `${inputBaseClass} ${
    hasError
      ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-300 focus:border-blue-400 focus:ring-blue-100'
  }`
}

export default function ProductForm({ product, isSaving, onSubmit, onCancel }) {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const isEditing = Boolean(product)

  useEffect(() => {
    if (product) {
      setValues({
        nombre: product.nombre ?? '',
        precio: product.precio ?? '',
        stock: product.stock ?? '',
      })
    } else {
      setValues(EMPTY_FORM)
    }

    setErrors({})
  }, [product])

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const nextErrors = validate(values)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    const saved = await onSubmit({
      nombre: values.nombre.trim(),
      precio: Number(values.precio),
      stock: Number(values.stock),
    })

    if (saved && !isEditing) {
      setValues(EMPTY_FORM)
      setErrors({})
    }
  }

  return (
    <section
      className="rounded-xl border border-slate-200 bg-white md:sticky md:top-5"
      aria-labelledby="product-form-title"
    >
      <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-600">
          {isEditing ? (
            <Pencil size={18} aria-hidden="true" />
          ) : (
            <PackagePlus size={18} aria-hidden="true" />
          )}
        </span>
        <div>
          <h2 id="product-form-title" className="m-0 text-sm font-semibold text-slate-900">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <p className="mt-1 mb-0 text-[11px] leading-4 text-slate-500">
            {isEditing
              ? `Editando el registro #${product.id}`
              : 'Completa la información del producto.'}
          </p>
        </div>
      </div>

      <form className="p-5" onSubmit={handleSubmit} noValidate>
        <div className="mb-5 min-w-0">
          <label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="nombre">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={values.nombre}
            onChange={handleChange}
            className={getInputClassName(Boolean(errors.nombre))}
            placeholder="Ej. Monitor 24 pulgadas"
            maxLength="100"
            autoComplete="off"
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? 'nombre-error' : undefined}
          />
          <div className="mt-1 flex min-h-4 justify-between gap-2 text-[10px] text-slate-400">
            {errors.nombre ? (
              <span className="text-red-600" id="nombre-error">
                {errors.nombre}
              </span>
            ) : (
              <span>Máximo 100 caracteres</span>
            )}
            <span>{values.nombre.length}/100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 min-[390px]:grid-cols-[1.2fr_0.8fr] min-[390px]:gap-3">
          <div className="mb-5 min-w-0">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="precio">
              Precio
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-xs text-slate-500"
                aria-hidden="true"
              >
                $
              </span>
              <input
                id="precio"
                name="precio"
                type="number"
                value={values.precio}
                onChange={handleChange}
                className={`${getInputClassName(Boolean(errors.precio))} pl-7 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                placeholder="0.00"
                min="0"
                step="0.01"
                inputMode="decimal"
                aria-invalid={Boolean(errors.precio)}
                aria-describedby={errors.precio ? 'precio-error' : undefined}
              />
            </div>
            {errors.precio && (
              <span className="mt-1 block text-[10px] leading-4 text-red-600" id="precio-error">
                {errors.precio}
              </span>
            )}
          </div>

          <div className="mb-5 min-w-0">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700" htmlFor="stock">
              Stock
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              value={values.stock}
              onChange={handleChange}
              className={`${getInputClassName(Boolean(errors.stock))} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
              placeholder="0"
              min="0"
              step="1"
              inputMode="numeric"
              aria-invalid={Boolean(errors.stock)}
              aria-describedby={errors.stock ? 'stock-error' : undefined}
            />
            {errors.stock && (
              <span className="mt-1 block text-[10px] leading-4 text-red-600" id="stock-error">
                {errors.stock}
              </span>
            )}
          </div>
        </div>

        <div className="mt-0.5 flex justify-end gap-2">
          {isEditing && (
            <IconButton
              label="Cancelar edición"
              tooltip="Cancelar"
              onClick={onCancel}
              disabled={isSaving}
            >
              <X size={18} aria-hidden="true" />
            </IconButton>
          )}
          <IconButton
            type="submit"
            label={isEditing ? 'Guardar cambios' : 'Registrar producto'}
            variant="primary"
            className="w-11"
            disabled={isSaving}
          >
            {isSaving ? (
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
            ) : isEditing ? (
              <Save size={18} aria-hidden="true" />
            ) : (
              <PackagePlus size={18} aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </form>
    </section>
  )
}

