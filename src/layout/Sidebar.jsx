export default function Sidebar({ setPage }) {
  const menuItems = [
    { id: "dashboard", label: "Painel" },
    { id: "register", label: "Novo Paciente" },
    { id: "evaluation", label: "Avaliação" },
    { id: "reports", label: "Relatórios" }
  ]

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <h1 style={{
          fontSize: "22px",
          fontWeight: "600",
          marginBottom: "5px"
        }}>SarcoSystem</h1>
        <p style={{
          fontSize: "12px",
          opacity: "0.85"
        }}>Clínica</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className="sidebar-button"
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.3)";
              e.target.style.transform = "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(255, 255, 255, 0.2)";
              e.target.style.transform = "translateX(0)";
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}