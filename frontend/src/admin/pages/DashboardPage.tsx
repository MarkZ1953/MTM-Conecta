import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useData } from '../context/DataContext'

export default function DashboardPage() {
  const { dashboardData } = useData()

  const StatCard = ({ title, value, change, icon }: { title: string; value: number; change: string; icon: string }) => (
    <div className="bg-card rounded-lg border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          <p className="text-xs text-teal font-semibold mt-2">{change}</p>
        </div>
        <div className="p-3 bg-secondary rounded-lg">
          <i className={`${icon} text-primary text-2xl`} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 pb-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Beneficiarios"
          value={dashboardData.totalBeneficiarios}
          change="+12% este mes"
          icon="pi pi-heart"
        />
        <StatCard
          title="Total Donaciones"
          value={dashboardData.totalDonaciones}
          change="+8% este mes"
          icon="pi pi-gift"
        />
        <StatCard
          title="Proyectos Activos"
          value={dashboardData.proyectosActivos}
          change="Sin cambios"
          icon="pi pi-folder-open"
        />
        <StatCard
          title="Donantes Registrados"
          value={dashboardData.donantesRegistrados}
          change="+5 nuevos"
          icon="pi pi-users"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart - Donations by Month */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4">Donaciones por Mes (€)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dashboardData.donacionesMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mes" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="monto"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Donations by Type */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4">Donaciones por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.donacionesPorTipo}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {dashboardData.donacionesPorTipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {[
              { type: 'Donación', description: 'Nueva donación de €500 registrada', time: 'Hace 2 horas' },
              { type: 'Beneficiario', description: 'Nuevo beneficiario registrado', time: 'Hace 5 horas' },
              { type: 'Proyecto', description: 'Proyecto completado: Educación', time: 'Hace 1 día' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.type}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-4">Objetivos del Mes</h3>
          <div className="space-y-4">
            {[
              { goal: 'Recaudación', current: 18500, target: 25000, color: 'bg-primary' },
              { goal: 'Beneficiarios Atendidos', current: 420, target: 500, color: 'bg-teal' },
              { goal: 'Nuevos Donantes', current: 15, target: 20, color: 'bg-accent' },
            ].map((item, i) => {
              const percentage = (item.current / item.target) * 100
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{item.goal}</span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

