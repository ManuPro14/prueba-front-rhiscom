import { AlertTriangle, LoaderCircle, Trash2, X } from 'lucide-react'
import { useEffect } from 'react'
import IconButton from './IconButton'

export default function ConfirmDialog({ product, isDeleting, onConfirm, onCancel }) {
  useEffect(() => {
    if (!product) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isDeleting) onCancel()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [product, isDeleting, onCancel])

  if (!product) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-5"
      role="presentation"
      onMouseDown={onCancel}
    >
      <div
        className="w-full max-w-[390px] rounded-xl border border-slate-200 bg-white p-6 text-center shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={22} aria-hidden="true" />
        </span>
        <h2 id="confirm-title" className="mt-3.5 mb-1.5 text-base font-semibold text-slate-900">
          Eliminar producto
        </h2>
        <p id="confirm-description" className="m-0 text-[13px] leading-5 text-slate-500">
          Se eliminará <strong>{product.nombre}</strong>. Esta acción no se puede
          deshacer.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <IconButton
            label="Cancelar eliminación"
            tooltip="Cancelar"
            onClick={onCancel}
            disabled={isDeleting}
            autoFocus
          >
            <X size={18} aria-hidden="true" />
          </IconButton>
          <IconButton
            label="Confirmar eliminación"
            tooltip="Eliminar"
            variant="dangerSolid"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 size={18} aria-hidden="true" />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  )
}

