import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowLeft,
  BarChart3,
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

const STORAGE_KEY = 'silveira_autodash_data_v1'
const departments = ['TI', 'Financeiro', 'RH', 'Comercial', 'Fiscal', 'Contábil', 'Marketing', 'Pessoal', 'Empresarial', 'Processos', 'CSI']
const types = ['IA', 'Automação', 'Power Automate']
const statuses = ['Ativa', 'Em Desenvolvimento', 'Pausada']
const chartColors = ['#2847F0', '#7C3AED', '#14B8A6']

const seedData = [
  { id: 1, name: 'Geração de Propostas Comerciais', department: 'Comercial', type: 'IA', time_before: 150, time_after: 20, implementation_date: '2026-03-25', responsible: 'Camila Rocha', description: 'Criação automática de proposta comercial com apoio de IA.', status: 'Ativa' },
  { id: 2, name: 'Lançamento Fiscal Automatizado', department: 'Fiscal', type: 'Power Automate', time_before: 60, time_after: 5, implementation_date: '2026-03-10', responsible: 'Marcos Pereira', description: 'Automação para agilizar lançamentos e conferências fiscais.', status: 'Ativa' },
  { id: 3, name: 'Envio de NFs para Clientes', department: 'Financeiro', type: 'Automação', time_before: 45, time_after: 5, implementation_date: '2026-02-28', responsible: 'Juliana Ferreira', description: 'Disparo automático de notas fiscais para clientes.', status: 'Ativa' },
  { id: 4, name: 'Análise Contábil por IA', department: 'Contábil', type: 'IA', time_before: 480, time_after: 60, implementation_date: '2026-02-15', responsible: 'Roberto Alves', description: 'Análise inicial de dados contábeis com apoio de IA.', status: 'Ativa' },
  { id: 5, name: 'Fluxo de Aprovação Interna', department: 'Processos', type: 'Power Automate', time_before: 90, time_after: 10, implementation_date: '2026-01-20', responsible: 'Fernanda Souza', description: 'Automação do fluxo de aprovação interna entre áreas.', status: 'Ativa' },
  { id: 6, name: 'Atendimento ao Cliente com Chatbot', department: 'Comercial', type: 'IA', time_before: 300, time_after: 45, implementation_date: '2026-01-10', responsible: 'Lucas Oliveira', description: 'Atendimento inicial e triagem automatizada.', status: 'Ativa' },
  { id: 7, name: 'Conciliação Bancária', department: 'Financeiro', type: 'Automação', time_before: 120, time_after: 10, implementation_date: '2025-12-01', responsible: 'Pedro Lima', description: 'Conciliação automatizada de lançamentos bancários.', status: 'Ativa' },
  { id: 8, name: 'Onboarding de Colaboradores', department: 'RH', type: 'Automação', time_before: 240, time_after: 30, implementation_date: '2025-11-15', responsible: 'Ana Martins', description: 'Fluxo de onboarding com tarefas e lembretes automáticos.', status: 'Ativa' },
  { id: 9, name: 'Classificação de E-mails', department: 'TI', type: 'IA', time_before: 60, time_after: 5, implementation_date: '2025-10-08', responsible: 'Diego Ramos', description: 'Classificação inteligente de mensagens por prioridade.', status: 'Ativa' },
  { id: 10, name: 'Geração Automática de Relatórios', department: 'CSI', type: 'IA', time_before: 180, time_after: 15, implementation_date: '2025-09-12', responsible: 'Felipe Vidoi', description: 'Geração automatizada de relatórios gerenciais.', status: 'Ativa' },
]

function loadAutomations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedData
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : seedData
  } catch {
    return seedData
  }
}

function saveAutomations(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
  const date = new Date(dateStr)
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
      const date = new Date(item.implementation_date)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      monthMap[key] = (monthMap[key] || 0) + 1
    })

    return Object.entries(monthMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ month: monthLabel(`${key}-01`), total: count }))
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
            <Bar dataKey="total" radius={[8, 8, 0, 0]} fill="#2847F0" />
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
            <Bar dataKey="antes" fill="#EF4444" radius={[6, 6, 0, 0]} />
            <Bar dataKey="depois" fill="#14B8A6" radius={[6, 6, 0, 0]} />
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

function AutomationTable({ automations, isAdmin, onDelete }) {
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
    </div>
  )
}

function AddAutomationForm({ onSave }) {
  const navigate = useNavigate()
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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      id: Date.now(),
      ...form,
      time_before: Number(form.time_before),
      time_after: Number(form.time_after),
    })
    navigate('/admin')
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
            <button type="submit" className="primary-btn">Cadastrar Automação</button>
            <button type="button" className="secondary-btn" onClick={() => navigate('/admin')}>Cancelar</button>
          </div>
        </form>
      </Card>
    </div>
  )
}

function AdminView({ automations, onDelete }) {
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
      <AutomationTable automations={automations} isAdmin onDelete={onDelete} />
    </div>
  )
}

function Sidebar({ onReset }) {
  const location = useLocation()
  const isAdminArea = location.pathname.startsWith('/admin')

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">S</div>
        <div>
          <div className="brand-title">SILVEIRA</div>
          <div className="brand-subtitle">CONTABILIDADE</div>
        </div>
      </div>

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
          <LayoutDashboard size={16} />
          Público
        </NavLink>

        {isAdminArea ? (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Settings size={16} />
            Área Administrativa
          </NavLink>
        ) : null}
      </nav>

      <div className="sidebar-info">
        <div className="info-box">
          <div className="info-title">Como usar</div>
          <p>O dashboard público é só visualização. A área administrativa serve para cadastrar e manter as automações.</p>
        </div>
        <div className="info-box">
          <div className="info-title">Persistência</div>
          <p>Os dados ficam salvos no navegador usando localStorage. Se quiser voltar ao exemplo, use o reset.</p>
        </div>
      </div>

      <div className="sidebar-footer">
        {isAdminArea ? (
          <button className="secondary-btn full-btn" onClick={onReset}>
            <BarChart3 size={16} />
            Resetar Exemplo
          </button>
        ) : null}
        <div className="footer-note">Projeto React local · sem Base44</div>
      </div>
    </aside>
  )
}

export default function App() {
  const [automations, setAutomations] = useState([])

  useEffect(() => {
    setAutomations(loadAutomations())
  }, [])

  useEffect(() => {
    if (automations.length) saveAutomations(automations)
  }, [automations])

  const addAutomation = (item) => {
    const updated = [item, ...automations]
    setAutomations(updated)
    saveAutomations(updated)
  }

  const deleteAutomation = (id) => {
    const updated = automations.filter((item) => item.id !== id)
    setAutomations(updated)
    saveAutomations(updated)
  }

  const resetData = () => {
    setAutomations(seedData)
    saveAutomations(seedData)
  }

  return (
    <div className="app-shell">
      <Sidebar onReset={resetData} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardView automations={automations} />} />
          <Route path="/admin" element={<AdminView automations={automations} onDelete={deleteAutomation} />} />
          <Route path="/admin/add" element={<AddAutomationForm onSave={addAutomation} />} />
        </Routes>
      </main>
    </div>
  )
}
