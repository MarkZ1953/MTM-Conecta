import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@mtm.org')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    login(email, password)

    if (email !== 'admin@mtm.org' || password !== 'admin123') {
      setError('Credenciales inválidas. Prueba con admin@mtm.org / admin123')
    }
  }

  return (
    <div className="min-h-screen bg-primary-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3 bg-white bg-opacity-10 backdrop-blur-md px-6 py-4 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <i className="pi pi-heart text-white text-lg" />
            </div>
            <div className="text-white">
              <p className="font-bold text-lg">Fundación MTM</p>
              <p className="text-xs text-white/60">Panel Administrativo</p>
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
                  placeholder="admin@mtm.org"
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
                />
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-border accent-primary" />
                <span className="text-muted-foreground">Recuérdame</span>
              </label>
              <a href="#" className="text-primary hover:opacity-80 font-medium">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary-gradient hover:opacity-90 text-white font-semibold py-2.5 rounded-lg transition-all transform hover:scale-105 active:scale-95"
            >
              Acceder
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Credenciales de demo:</p>
            <div className="bg-secondary rounded-lg p-3 space-y-1 text-xs text-foreground">
              <p>📧 Email: <span className="font-mono font-semibold">admin@mtm.org</span></p>
              <p>🔑 Password: <span className="font-mono font-semibold">admin123</span></p>
            </div>
          </div>
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
