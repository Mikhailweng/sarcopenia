import { useMemo, useState } from "react"
import PageHeader from "../components/PageHeader"
import StatCard from "../components/StatCard"
import PrimaryAction from "../components/PrimaryAction"
import DataTable from "../components/DataTable"
import SectionCard from "../components/SectionCard"

export default function Patients({ patients, onAddPatient, onStartEvaluation, onSelectPatient, selectedPatient }) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "female",
    weight: "",
    height: "",
    calf: "",
    cpf: ""
  })
  const [error, setError] = useState("")

  const stats = useMemo(() => {
    const total = patients.length
    const updatedAt = patients
      .map((patient) => new Date(patient.updatedAt))
      .sort((a, b) => b - a)
    return {
      total,
      newRegistrations: total > 0 ? Math.max(0, Math.floor(total * 0.2)) : 0,
      lastUpdate: updatedAt.length ? updatedAt[0].toLocaleDateString() : "-"
    }
  }, [patients])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setError("")
  }

  function handleSubmit(event) {
    event.preventDefault()
    const { name, age, weight, height, calf, cpf } = formData
    if (!name || !age || !weight || !height || !calf || !cpf) {
      setError("Preencha todos os campos para cadastrar o paciente.")
      return
    }

    onAddPatient({
      ...formData,
      age: Number(age),
      weight: Number(weight),
      height: Number(height),
      calf: Number(calf),
      lastEvaluation: "Sem avaliação",
      updatedAt: new Date().toISOString().split("T")[0]
    })
    setFormData({ name: "", age: "", gender: "female", weight: "", height: "", calf: "", cpf: "" })
    setShowForm(false)
  }

  const columns = [
    { key: "name", label: "Nome" },
    { key: "cpf", label: "CPF / ID" },
    { key: "age", label: "Idade" },
    { key: "lastEvaluation", label: "Última Avaliação" },
    { key: "actions", label: "Ação" }
  ]

  return (
    <div>
      <PageHeader
        title="Gerenciamento de Pacientes"
        subtitle="Visualize, cadastre e organize sua base clínica"
        action={<PrimaryAction text="+ Novo Paciente" onClick={() => setShowForm((value) => !value)} />}
      />

      <div className="stat-grid">
        <StatCard label="Total de Pacientes" value={stats.total} />
        <StatCard label="Novos Cadastros" value={stats.newRegistrations} />
        <StatCard label="Última Atualização" value={stats.lastUpdate} />
      </div>

      {showForm && (
        <SectionCard title="Cadastro de Novo Paciente">
          {error && <div className="form-message error">{error}</div>}
          <form onSubmit={handleSubmit} className="patient-form">
            <div className="form-row full">
              <div className="form-group">
                <label className="form-label">Nome</label>
                <input name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Nome completo" />
              </div>
              <div className="form-group">
                <label className="form-label">CPF / ID</label>
                <input name="cpf" value={formData.cpf} onChange={handleChange} className="form-input" placeholder="000.000.000-00" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Idade</label>
                <input name="age" type="number" min="0" value={formData.age} onChange={handleChange} className="form-input" placeholder="Ex: 65" />
              </div>
              <div className="form-group">
                <label className="form-label">Sexo</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
                  <option value="female">Feminino</option>
                  <option value="male">Masculino</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Peso (kg)</label>
                <input name="weight" type="number" step="0.1" min="0" value={formData.weight} onChange={handleChange} className="form-input" placeholder="Ex: 70" />
              </div>
              <div className="form-group">
                <label className="form-label">Altura (m)</label>
                <input name="height" type="number" step="0.01" min="0" value={formData.height} onChange={handleChange} className="form-input" placeholder="Ex: 1.70" />
              </div>
            </div>

            <div className="form-row full">
              <div className="form-group">
                <label className="form-label">Circunferência da Panturrilha (cm)</label>
                <input name="calf" type="number" step="0.1" min="0" value={formData.calf} onChange={handleChange} className="form-input" placeholder="Ex: 33" />
              </div>
            </div>

            <PrimaryAction text="Cadastrar Paciente" type="submit" />
          </form>
        </SectionCard>
      )}

      <SectionCard title="Lista de Pacientes">
        <DataTable
          columns={columns}
          data={patients}
          renderRow={(patient) => (
            <tr key={patient.cpf} className={selectedPatient?.cpf === patient.cpf ? "selected-row" : ""}>
              <td>{patient.name}</td>
              <td>{patient.cpf}</td>
              <td>{patient.age}</td>
              <td>{patient.lastEvaluation}</td>
              <td className="table-actions">
                <button className="btn btn-secondary" onClick={() => onSelectPatient(patient)}>
                  Ver Perfil
                </button>
                <button className="btn btn-primary" onClick={() => onStartEvaluation(patient)}>
                  Iniciar Avaliação
                </button>
              </td>
            </tr>
          )}
          noDataText="Ainda não há pacientes cadastrados."
        />
      </SectionCard>

      <div className="card-grid">
        <SectionCard title="Histórico de Cadastro">
          <p className="card-note">Registros recentes de admissões e atualizações de pacientes para controle clínico.</p>
          <ul className="history-list">
            {patients.slice(0, 3).map((patient) => (
              <li key={patient.cpf}>{patient.name} — atualizado em {patient.updatedAt}</li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Pacientes Recentes">
          <p className="card-note">Acesso rápido aos últimos pacientes adicionados ao sistema.</p>
          <ul className="history-list">
            {patients.slice(-3).reverse().map((patient) => (
              <li key={patient.cpf}>{patient.name} — {patient.cpf}</li>
            ))}
          </ul>
        </SectionCard>
      </div>

      
    </div>
  )
}
