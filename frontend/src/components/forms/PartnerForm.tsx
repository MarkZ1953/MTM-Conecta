import { useState } from 'react'

interface PartnerFormProps {
  onClose: () => void
}

export default function PartnerForm({ onClose }: PartnerFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    interest: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'El nombre de la empresa es requerido'
    }
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'El nombre del contacto es requerido'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }
    if (!formData.interest.trim()) {
      newErrors.interest = 'Cuéntanos tu interés en la alianza'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({ companyName: '', contactName: '', email: '', phone: '', interest: '' })
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="pi pi-check-circle text-amber-600 text-2xl" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">¡Excelente propuesta!</h3>
        <p className="text-muted-foreground">Tu solicitud de alianza ha sido recibida. Nos comunicaremos pronto.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Nombre de la Empresa</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.companyName ? 'border-amber-300 bg-amber-50' : 'border-border/50'
          } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all`}
          placeholder="Tu empresa"
        />
        {errors.companyName && <p className="text-xs text-amber-600 mt-1">{errors.companyName}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Persona de Contacto</label>
        <input
          type="text"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.contactName ? 'border-amber-300 bg-amber-50' : 'border-border/50'
          } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all`}
          placeholder="Tu nombre"
        />
        {errors.contactName && <p className="text-xs text-amber-600 mt-1">{errors.contactName}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.email ? 'border-amber-300 bg-amber-50' : 'border-border/50'
          } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all`}
          placeholder="tu@empresa.com"
        />
        {errors.email && <p className="text-xs text-amber-600 mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Teléfono</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.phone ? 'border-amber-300 bg-amber-50' : 'border-border/50'
          } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all`}
          placeholder="+57 300 000 0000"
        />
        {errors.phone && <p className="text-xs text-amber-600 mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Tu Propuesta de Alianza</label>
        <textarea
          name="interest"
          value={formData.interest}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.interest ? 'border-amber-300 bg-amber-50' : 'border-border/50'
          } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-200 transition-all resize-none`}
          placeholder="Cuéntanos cómo tu empresa puede aliarse con nosotros..."
          rows={3}
        />
        {errors.interest && <p className="text-xs text-amber-600 mt-1">{errors.interest}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-accent-foreground py-3 rounded-full font-semibold hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <i className="pi pi-building text-sm" /> Proponer Alianza
          </>
        )}
      </button>
    </form>
  )
}
