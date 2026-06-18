import PageHeader from "../components/PageHeader"
import StatCard from "../components/StatCard"
import SectionCard from "../components/SectionCard"

export default function Dashboard({ patients, evaluations, reports }) {
  return (
    <div>
      <PageHeader
        title="Bem-vindo ao SarcoSystem"
        subtitle="Acompanhe seus pacientes e gerencie avaliações clínicas de sarcopenia com eficiência"
      />

      <div className="stat-grid">
        <StatCard label="Pacientes Ativos" value={patients.length} />
        <StatCard label="Avaliações Realizadas" value={evaluations.length} />
        <StatCard label="Relatórios Pendentes" value={reports.filter((r) => r.status === "warning").length} />
      </div>

      <SectionCard title="Atividades Recentes">
        <div className="activity-list">
          {[
            { patient: "Maria Silva", action: "Avaliação realizada", time: "Há 2 horas" },
            { patient: "João Santos", action: "Novo registro", time: "Há 5 horas" },
            { patient: "Ana Costa", action: "Avaliação agendada", time: "Ontem" }
          ].map((item, i) => (
            <div key={i} className="activity-item">
              <div className="activity-content">
                <p className="activity-patient">{item.patient}</p>
                <p className="activity-action">{item.action}</p>
              </div>
              <p className="activity-time">{item.time}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="card-grid">
        <SectionCard title="Avisos Clínicos">
          <p className="card-note">Notificações e alertas sobre pacientes com possível sarcopenia.</p>
          <ul className="history-list">
            <li>3 pacientes com avaliação pendente</li>
            <li>1 paciente com diagnóstico crítico</li>
            <li>2 relatórios a validar</li>
          </ul>
        </SectionCard>
        <SectionCard title="Próximas Ações">
          <p className="card-note">Itens prioritários para hoje.</p>
          <ul className="history-list">
            <li>Avaliar paciente: Carlos Eduardo</li>
            <li>Revisar laudo de Maria Silva</li>
            <li>Cadastrar novo paciente: Lucia Ferreira</li>
          </ul>
        </SectionCard>
      </div>
    </div>
  )
}
