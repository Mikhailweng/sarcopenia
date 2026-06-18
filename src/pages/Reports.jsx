import PageHeader from "../components/PageHeader"
import StatCard from "../components/StatCard"
import SectionCard from "../components/SectionCard"
import DataTable from "../components/DataTable"

export default function Reports({ reports }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "urgent":
        return { bg: "#fee2e2", text: "#991b1b", border: "#fecaca", badge: "Urgente" }
      case "warning":
        return { bg: "#fef3c7", text: "#b45309", border: "#fcd34d", badge: "Pendente" }
      case "success":
        return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0", badge: "Finalizado" }
      default:
        return { bg: "#f3f4f6", text: "#4b5563", border: "#e5e7eb", badge: "" }
    }
  }

  const stats = [
    { label: "Total de Relatórios", value: reports.length },
    { label: "Gerados na Semana", value: Math.max(0, Math.floor(reports.length * 0.3)) },
    { label: "Pendentes", value: reports.filter((r) => r.status === "warning").length }
  ]

  const columns = [
    { key: "patient", label: "Paciente" },
    { key: "diagnosis", label: "Diagnóstico" },
    { key: "date", label: "Data" },
    { key: "professional", label: "Profissional" },
    { key: "actions", label: "Ação" }
  ]

  return (
    <div>
      <PageHeader
        title="Relatórios e Laudos"
        subtitle="Visualize e exporte diagnósticos clínicos finalizados"
      />

      <div className="stat-grid">
        {stats.map((stat, i) => (
          <StatCard key={i} label={stat.label} value={stat.value} icon={stat.icon} />
        ))}
      </div>

      <SectionCard title="Histórico de Relatórios">
        <DataTable
          columns={columns}
          data={reports}
          renderRow={(report) => {
            const statusStyle = getStatusColor(report.status)
            return (
              <tr key={report.id}>
                <td>{report.patient}</td>
                <td>{report.diagnosis}</td>
                <td>{report.date}</td>
                <td>{report.professional}</td>
                <td className="table-actions">
                  <button className="btn btn-secondary" style={{ fontSize: "12px" }}>
                    Visualizar
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: "12px", background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}` }}
                  >
                    Exportar PDF
                  </button>
                </td>
              </tr>
            )
          }}
          noDataText="Nenhum relatório disponível."
        />
      </SectionCard>
    </div>
  )
}
