import Sidebar from "./Sidebar"

export default function MainLayout({ children, page, setPage }) {
  return (
    <div className="app-layout">
      <Sidebar page={page} setPage={setPage} />
      <main className="app-main">
        <div className="content-wrapper">{children}</div>
      </main>
    </div>
  )
}
