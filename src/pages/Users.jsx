import PageHeader from "../components/PageHeader"
import SectionCard from "../components/SectionCard"

export default function Users() {
  return (
    <div>
      <PageHeader title="Usuários" subtitle="Gerencie perfis de profissionais e equipes" />

      <div className="card-grid-sm">
        <SectionCard title="Equipe Clínica">
          <p className="card-note">Em breve, a administração de usuários estará disponível com permissões de acesso e perfis profissionais.</p>
          <ul className="history-list">
            <li>Dr. Lucas Ribeiro — Médico responsável</li>
            <li>Dra. Ana Lima — Especialista em Geriatria</li>
            <li>Enf. Camila Souza — Coordenadora de ambulatório</li>
          </ul>
        </SectionCard>
        <SectionCard title="Status de Acesso">
          <p className="card-note">Os usuários podem receber acessos específicos para visualização de avaliações e emissão de laudos.</p>
        </SectionCard>
      </div>
    </div>
  )
}
