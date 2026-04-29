import { useState } from 'react'

interface DonateFormProps {
  onClose: () => void
}

export default function DonateForm({ onClose }: DonateFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    amount: '',
    type: 'monetary',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre es requerido'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }
    if (formData.type === 'monetary' && !formData.amount) {
      newErrors.amount = 'El monto es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      // Simular envío
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({ fullName: '', email: '', phone: '', amount: '', type: 'monetary' })
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="pi pi-check-circle text-rose text-2xl" />
        </div>
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">¡Gracias por tu donación!</h3>
        <p className="text-muted-foreground">Tu aporte ha sido recibido correctamente. Nos pondremos en contacto pronto.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Nombre Completo</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.fullName ? 'border-rose/50 bg-rose/5' : 'border-border/50'
          } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all`}
          placeholder="Tu nombre"
        />
        {errors.fullName && <p className="text-xs text-rose mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.email ? 'border-rose/50 bg-rose/5' : 'border-border/50'
          } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all`}
          placeholder="tu@email.com"
        />
        {errors.email && <p className="text-xs text-rose mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Teléfono</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={`w-full px-4 py-2.5 rounded-xl border ${
            errors.phone ? 'border-rose/50 bg-rose/5' : 'border-border/50'
          } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all`}
          placeholder="+57 300 000 0000"
        />
        {errors.phone && <p className="text-xs text-rose mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Tipo de Donación</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full px-4 py-2.5 rounded-xl border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all"
        >
          <option value="monetary">Económica</option>
          <option value="species">En especie</option>
        </select>
      </div>

      {formData.type === 'monetary' && (
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Monto (COP)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-xl border ${
              errors.amount ? 'border-rose/50 bg-rose/5' : 'border-border/50'
            } text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose/20 transition-all`}
            placeholder="100.000"
          />
          {errors.amount && <p className="text-xs text-rose mt-1">{errors.amount}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-rose text-white py-3 rounded-full font-semibold hover:bg-rose/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <i className="pi pi-heart text-sm fill-current" /> Confirmar Donación
          </>
        )}
      </button>
    </form>
  )
}
