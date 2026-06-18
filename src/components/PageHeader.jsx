export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">Painel Clínico</p>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      {action && <div className="page-header-action">{action}</div>}
    </div>
  )
}
