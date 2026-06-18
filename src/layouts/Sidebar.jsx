export default function Sidebar({ page, setPage }) {
  const menuItems = [
    { id: "dashboard", label: "Painel" },
    { id: "patients", label: "Pacientes" },
    { id: "evaluation", label: "Avaliação" },
    { id: "reports", label: "Relatórios" },
    { id: "users", label: "Usuários" }
  ]

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <h1>SarcoSystem</h1>
        <p>Diagnóstico Clínico</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`sidebar-button ${page === item.id ? "active" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
