import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Pencil,
  Clock3,
  Gauge,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  TrendingUp,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import logoImg from './assets/logo.png'

const departments = ['TI', 'Financeiro', 'RH', 'Comercial', 'Fiscal', 'Contábil', 'Marketing', 'Pessoal', 'Empresarial', 'Processos', 'CSI']
const types = ['IA', 'Automação', 'Power Automate']
const statuses = ['Ativa', 'Em Desenvolvimento', 'Pausada']
const chartColors = ['#1a1f3a', '#C3996B', '#2B9FAE']

const API_BASE_URL = '/api'

async function fetchAutomations() {
  const response = await fetch(`${API_BASE_URL}/automations/`)
  if (!response.ok) throw new Error('Falha ao carregar automações.')
  return response.json()
}

async function createAutomation(payload) {
  const response = await fetch(`${API_BASE_URL}/automations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Falha ao criar automação.')
  return response.json()
}

async function removeAutomation(id) {
  const response = await fetch(`${API_BASE_URL}/automations/${id}/`, { method: 'DELETE' })
  if (!response.ok) throw new Error('Falha ao excluir automação.')
}

async function updateAutomation(id, payload) {
  const response = await fetch(`${API_BASE_URL}/automations/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error('Falha ao atualizar automação.')
  return response.json()
}


function formatMinutes(min) {
  const value = Number(min || 0)
  const h = Math.floor(value / 60)
  const m = value % 60
  if (h > 0 && m > 0) return `${h}h ${m}min`
  if (h > 0) return `${h}h`
  return `${m}min`
}

function formatPercent(value) {
  return `${Number(value || 0).toFixed(1)}%`
}

function monthLabel(dateStr) {
  const [year, month] = String(dateStr).split('-')
  if (!year || !month) return dateStr
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '')
}

function Card({ children }) {
  return <section className="card">{children}</section>
}

function Badge({ children, className = '' }) {
  return <span className={`badge ${className}`}>{children}</span>
}

function PanelHeader({ title, subtitle, actions }) {
  return (
    <div className="panel-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {actions ? <div className="panel-actions">{actions}</div> : null}
    </div>
  )
}

function KPIGrid({ automations }) {
  const data = useMemo(() => {
    const total = automations.length
    const totalBefore = automations.reduce((sum, a) => sum + Number(a.time_before || 0), 0)
    const totalAfter = automations.reduce((sum, a) => sum + Number(a.time_after || 0), 0)
    const totalSaved = totalBefore - totalAfter
    const percentGain = totalBefore > 0 ? (totalSaved / totalBefore) * 100 : 0
    return { total, totalBefore, totalAfter, totalSaved, percentGain }
  }, [automations])

  const cards = [
    { title: 'Total de Automações', value: data.total, icon: Sparkles },
    { title: 'Tempo Total Antes', value: formatMinutes(data.totalBefore), icon: Clock3 },
    { title: 'Tempo Total Depois', value: formatMinutes(data.totalAfter), icon: TrendingUp },
    { title: 'Tempo Economizado', value: formatMinutes(data.totalSaved), icon: Gauge },
    { title: 'Ganho de Produtividade', value: formatPercent(data.percentGain), icon: Activity },
  ]

  return (
    <div className="kpi-grid">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <div className="kpi-icon">
              <Icon className={`icon ${index === 0 ? 'blue' : index === 1 ? 'gray' : index === 2 ? 'teal' : index === 3 ? 'violet' : 'amber'}`} />
            </div>
            <div className="kpi-value">{card.value}</div>
            <div className="kpi-label">{card.title}</div>
          </Card>
        )
      })}
    </div>
  )
}

function EvolutionChart({ automations }) {
  const data = useMemo(() => {
    const monthMap = {}
    automations.forEach((item) => {
      if (!item.implementation_date) return
      const [year, month] = String(item.implementation_date).split('-')
      if (!year || !month) return
      const key = `${year}-${month.padStart(2, '0')}`
      monthMap[key] = (monthMap[key] || 0) + 1
    })

    return Object.entries(monthMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ month: monthLabel(key), total: count }))
  }, [automations])

  return (
    <Card>
      <h2 className="card-title">Evolução das Automações</h2>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" radius={[8, 8, 0, 0]} fill={chartColors[0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function TypeChart({ automations }) {
  const data = useMemo(() => {
    return types
      .map((type) => ({ name: type, value: automations.filter((item) => item.type === type).length }))
      .filter((item) => item.value > 0)
  }, [automations])

  return (
    <Card>
      <h2 className="card-title">Tipo de Automação</h2>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function TimeChart({ automations }) {
  const data = useMemo(() => {
    return [...automations]
      .sort((a, b) => new Date(b.implementation_date) - new Date(a.implementation_date))
      .map((item) => ({
        name: item.name.length > 24 ? `${item.name.slice(0, 24)}...` : item.name,
        antes: Number(item.time_before || 0),
        depois: Number(item.time_after || 0),
      }))
  }, [automations])

  return (
    <Card>
      <h2 className="card-title">Tempo Antes vs Depois</h2>
      <div className="chart-box chart-box-large">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" angle={-18} textAnchor="end" interval={0} height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="antes" fill="#1a1f3a" radius={[6, 6, 0, 0]} />
            <Bar dataKey="depois" fill="#C3996B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function TypeBadge({ type }) {
  const styles = {
    IA: 'badge-blue',
    'Automação': 'badge-green',
    'Power Automate': 'badge-violet',
  }
  return <Badge className={styles[type] || ''}>{type}</Badge>
}

function AutomationTable({ automations, isAdmin, onDelete, onEdit }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  const filtered = useMemo(() => {
    return automations.filter((item) => {
      const searchText = search.toLowerCase()
      const searchOk = item.name.toLowerCase().includes(searchText) || item.responsible.toLowerCase().includes(searchText)
      const typeOk = typeFilter === 'all' || item.type === typeFilter
      const departmentOk = departmentFilter === 'all' || item.department === departmentFilter
      return searchOk && typeOk && departmentOk
    })
  }, [automations, search, typeFilter, departmentFilter])

  return (
    <Card>
      <h2 className="card-title">Detalhamento das Automações</h2>

      <div className="filters-row">
        <div className="search-box">
          <Search size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar automação..." />
        </div>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">Todos os tipos</option>
          {types.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          <option value="all">Todas as áreas</option>
          {departments.map((dep) => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Automação</th>
              <th>Área</th>
              <th>Tipo</th>
              <th>Antes</th>
              <th>Depois</th>
              <th>Economizado</th>
              <th>Data</th>
              <th>Responsável</th>
              {isAdmin ? <th className="text-right">Ação</th> : null}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => {
              const saved = Number(item.time_before || 0) - Number(item.time_after || 0)
              return (
                <tr key={item.id}>
                  <td className="strong">{item.name}</td>
                  <td>{item.department}</td>
                  <td><TypeBadge type={item.type} /></td>
                  <td>{formatMinutes(item.time_before)}</td>
                  <td>{formatMinutes(item.time_after)}</td>
                  <td className="saved">{formatMinutes(saved)}</td>
                  <td>{new Date(item.implementation_date).toLocaleDateString('pt-BR')}</td>
                  <td>{item.responsible}</td>
                  {isAdmin ? (
                    <td className="text-right">
                      <button className="icon-button edit" onClick={() => onEdit(item)} title="Editar">
                        <Pencil size={16} />
                      </button>
                      <button className="icon-button" onClick={() => onDelete(item.id)} title="Excluir">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  ) : null}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function InfoCards() {
  return (
    <div className="two-columns">
      <Card>
        <h2 className="card-title">Como usar</h2>
        <p className="muted">O dashboard público é só visualização. A área administrativa serve para cadastrar e manter as automações.</p>
      </Card>
      <Card>
        <h2 className="card-title">Persistência</h2>
        <p className="muted">Os dados ficam salvos no banco de dados.</p>
      </Card>
    </div>
  )
}

function DashboardView({ automations }) {
  return (
    <div className="page-stack">
      <PanelHeader title="Painel de Automações" subtitle="Visão executiva das automações implementadas" />
      <KPIGrid automations={automations} />
      <div className="two-columns">
        <EvolutionChart automations={automations} />
        <TypeChart automations={automations} />
      </div>
      <TimeChart automations={automations} />
      <AutomationTable automations={automations} />
      <InfoCards />
    </div>
  )
}

function AddAutomationForm({ onSave }) {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    department: '',
    type: '',
    time_before: '',
    time_after: '',
    implementation_date: '',
    responsible: '',
    description: '',
    status: 'Ativa',
  })

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const saved = form.time_before && form.time_after ? Number(form.time_before) - Number(form.time_after) : null
  const gain = saved !== null && Number(form.time_before) > 0 ? ((saved / Number(form.time_before)) * 100).toFixed(1) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({
        ...form,
        time_before: Number(form.time_before),
        time_after: Number(form.time_after),
      })
      navigate('/admin')
    } catch (err) {
      setError(err?.message || 'Falha ao salvar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-page">
      <button onClick={() => navigate('/admin')} className="back-link">
        <ArrowLeft size={16} />
        Voltar ao painel administrativo
      </button>

      <Card>
        <h2 className="card-title xl">Nova Automação</h2>
        <p className="muted">Preencha os dados da automação implementada.</p>
        {error ? <p className="muted">{error}</p> : null}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field full">
            <label>Nome da Automação *</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="Ex: Geração automática de relatórios" />
          </div>

          <div className="field">
            <label>Área / Departamento *</label>
            <select value={form.department} onChange={(e) => update('department', e.target.value)} required>
              <option value="">Selecione</option>
              {departments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Tipo de Automação *</label>
            <select value={form.type} onChange={(e) => update('type', e.target.value)} required>
              <option value="">Selecione</option>
              {types.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Tempo Antes (minutos) *</label>
            <input type="number" min="0" value={form.time_before} onChange={(e) => update('time_before', e.target.value)} required placeholder="Ex: 120" />
          </div>

          <div className="field">
            <label>Tempo Depois (minutos) *</label>
            <input type="number" min="0" value={form.time_after} onChange={(e) => update('time_after', e.target.value)} required placeholder="Ex: 15" />
          </div>

          {saved !== null ? (
            <div className="highlight-box full">
              <div className="muted">Tempo economizado</div>
              <div className="highlight-value">{formatMinutes(saved)}{gain ? ` (${gain}% de ganho)` : ''}</div>
            </div>
          ) : null}

          <div className="field">
            <label>Data de Implementação *</label>
            <input type="date" value={form.implementation_date} onChange={(e) => update('implementation_date', e.target.value)} required />
          </div>

          <div className="field">
            <label>Responsável *</label>
            <input value={form.responsible} onChange={(e) => update('responsible', e.target.value)} required placeholder="Nome do responsável" />
          </div>

          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Descreva brevemente a automação..." rows={4} />
          </div>

          <div className="button-row full">
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? 'Salvando...' : 'Cadastrar Automação'}
            </button>
            <button type="button" className="secondary-btn" onClick={() => navigate('/admin')} disabled={saving}>
              Cancelar
            </button>
          </div>
        </form>
      </Card>
    </div>
  )
}

function EditAutomationModal({ automation, onClose, onSave }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    department: '',
    type: '',
    time_before: '',
    time_after: '',
    implementation_date: '',
    responsible: '',
    description: '',
    status: 'Ativa',
  })

  useEffect(() => {
    if (!automation) return
    setForm({
      name: automation.name || '',
      department: automation.department || '',
      type: automation.type || '',
      time_before: automation.time_before ?? '',
      time_after: automation.time_after ?? '',
      implementation_date: automation.implementation_date || '',
      responsible: automation.responsible || '',
      description: automation.description || '',
      status: automation.status || 'Ativa',
    })
  }, [automation])

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const saved = form.time_before !== '' && form.time_after !== '' ? Number(form.time_before) - Number(form.time_after) : null
  const gain = saved !== null && Number(form.time_before) > 0 ? ((saved / Number(form.time_before)) * 100).toFixed(1) : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave(automation.id, {
        ...form,
        time_before: Number(form.time_before),
        time_after: Number(form.time_after),
      })
      onClose()
    } catch (err) {
      setError(err?.message || 'Falha ao atualizar.')
    } finally {
      setSaving(false)
    }
  }

  if (!automation) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal-header">
          <div>
            <h3>Editar Automação</h3>
            <p className="muted">Atualize os dados da automação selecionada.</p>
          </div>
          <button className="icon-button close" onClick={onClose} title="Fechar">×</button>
        </div>
        {error ? <p className="muted">{error}</p> : null}
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="field full">
            <label>Nome da Automação *</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>

          <div className="field">
            <label>Área / Departamento *</label>
            <select value={form.department} onChange={(e) => update('department', e.target.value)} required>
              <option value="">Selecione</option>
              {departments.map((dep) => <option key={dep} value={dep}>{dep}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Tipo de Automação *</label>
            <select value={form.type} onChange={(e) => update('type', e.target.value)} required>
              <option value="">Selecione</option>
              {types.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Tempo Antes (minutos) *</label>
            <input type="number" min="0" value={form.time_before} onChange={(e) => update('time_before', e.target.value)} required />
          </div>

          <div className="field">
            <label>Tempo Depois (minutos) *</label>
            <input type="number" min="0" value={form.time_after} onChange={(e) => update('time_after', e.target.value)} required />
          </div>

          {saved !== null ? (
            <div className="highlight-box full">
              <div className="muted">Tempo economizado</div>
              <div className="highlight-value">{formatMinutes(saved)}{gain ? ` (${gain}% de ganho)` : ''}</div>
            </div>
          ) : null}

          <div className="field">
            <label>Data de Implementação *</label>
            <input type="date" value={form.implementation_date} onChange={(e) => update('implementation_date', e.target.value)} required />
          </div>

          <div className="field">
            <label>Responsável *</label>
            <input value={form.responsible} onChange={(e) => update('responsible', e.target.value)} required />
          </div>

          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={(e) => update('status', e.target.value)}>
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} />
          </div>

          <div className="button-row full">
            <button type="submit" className="primary-btn" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <button type="button" className="secondary-btn" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AdminView({ automations, onDelete, onEdit }) {
  return (
    <div className="page-stack">
      <PanelHeader
        title="Painel Administrativo"
        subtitle="Gerencie as automações cadastradas e alimente o dashboard público."
        actions={
          <Link to="/admin/add" className="primary-btn inline-btn">
            <Plus size={16} />
            Nova Automação
          </Link>
        }
      />
      <KPIGrid automations={automations} />
      <div className="two-columns">
        <EvolutionChart automations={automations} />
        <TypeChart automations={automations} />
      </div>
      <TimeChart automations={automations} />
      <AutomationTable automations={automations} isAdmin onDelete={onDelete} onEdit={onEdit} />
      <InfoCards />
    </div>
  )
}

function Header() {
  const location = useLocation()
  const showAdminButton = location.pathname === '/admin'

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__branding">
          <img src={logoImg} alt="Silveira Contabilidade" className="branding__logo" />
          <div className="branding__text">
            <span className="branding__main">SILVEIRA</span>
            <span className="branding__sub">CONTABILIDADE</span>
          </div>
        </div>

        <nav className="header__nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <LayoutDashboard size={16} />
            Público
          </NavLink>
          {showAdminButton ? (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              <Settings size={16} />
              Área Administrativa
            </NavLink>
          ) : null}
        </nav>

        <div className="header__actions">
          <div className="header__spacer" />
        </div>
      </div>
    </header>
  )
}

export default function App() {
  const [automations, setAutomations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    let active = true
    fetchAutomations()
      .then((data) => {
        if (active) setAutomations(data)
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Falha ao carregar dados.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const refreshAutomations = async () => {
    const data = await fetchAutomations()
    setAutomations(data)
  }

  const addAutomation = async (item) => {
    await createAutomation(item)
    await refreshAutomations()
  }

  const deleteAutomation = async (id) => {
    await removeAutomation(id)
    await refreshAutomations()
  }

  const editAutomation = async (id, item) => {
    await updateAutomation(id, item)
    await refreshAutomations()
  }

  return (
    <div className="layout">
      <Header />
      <main className="layout__content">
        {loading ? <p className="muted">Carregando...</p> : null}
        {error ? <p className="muted">{error}</p> : null}
        <Routes>
          <Route path="/" element={<DashboardView automations={automations} />} />
          <Route
            path="/admin"
            element={<AdminView automations={automations} onDelete={deleteAutomation} onEdit={setEditing} />}
          />
          <Route path="/admin/add" element={<AddAutomationForm onSave={addAutomation} />} />
        </Routes>
      </main>
      <EditAutomationModal
        automation={editing}
        onClose={() => setEditing(null)}
        onSave={editAutomation}
      />
    </div>
  )
}
