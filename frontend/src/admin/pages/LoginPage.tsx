import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    const errorMsg = await login(email, password)
    setLoading(false)

    if (errorMsg) {
      setError(errorMsg)
    }
    // If null, AuthContext.user is set → AdminRouter renders AdminShell automatically
  }

  return (
    <div className="min-h-screen bg-primary-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-rose/80 flex items-center justify-center shadow-md">
              <i className="pi pi-heart text-white text-xl" />
            </div>
            <div>
              <p className="font-bold text-lg text-white drop-shadow">Fundación MTM</p>
              <p className="text-xs text-white/80">Panel Administrativo</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl shadow-2xl p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bienvenido</h1>
            <p className="text-muted-foreground text-sm mt-2">Accede a tu cuenta para continuar</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 bg-rose/10 border border-rose rounded-lg p-4">
              <i className="pi pi-exclamation-circle text-rose flex-shrink-0 mt-0.5 text-lg" />
              <p className="text-sm text-rose">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <i className="pi pi-envelope absolute left-3 top-3 text-muted-foreground text-base" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  placeholder="tu@correo.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <i className="pi pi-lock absolute left-3 top-3 text-muted-foreground text-base" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-gradient hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                'Acceder'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/70 text-sm">
            © 2024 Fundación MTM. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
