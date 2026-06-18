export default function SectionCard({ title, children, footer }) {
  return (
    <section className="section-card">
      <div className="section-card-header">
        <h2>{title}</h2>
      </div>
      <div className="section-card-body">{children}</div>
      {footer && <div className="section-card-footer">{footer}</div>}
    </section>
  )
}
