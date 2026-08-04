import { AlertCircle, CheckCircle2, X } from 'lucide-react'

const noticeStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-red-800',
}

export default function StatusBanner({ notice, onClose }) {
  if (!notice) return null

  const isSuccess = notice.type === 'success'

  return (
    <div
      className={`mb-4 grid grid-cols-[auto_1fr_auto] items-center gap-2.5 rounded-lg border px-3 py-2.5 text-xs ${noticeStyles[notice.type]}`}
      role={isSuccess ? 'status' : 'alert'}
    >
      {isSuccess ? (
        <CheckCircle2 size={18} aria-hidden="true" />
      ) : (
        <AlertCircle size={18} aria-hidden="true" />
      )}
      <p className="m-0">{notice.text}</p>
      <button
        type="button"
        className="grid size-7 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-current hover:bg-black/5"
        onClick={onClose}
        aria-label="Cerrar mensaje"
        title="Cerrar"
      >
        <X size={15} aria-hidden="true" />
      </button>
    </div>
  )
}

