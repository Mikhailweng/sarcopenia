import Sidebar from "./Sidebar"

export default function MainLayout({ children, setPage }) {
  return (
    <div className="app-layout">
      <Sidebar setPage={setPage} />

      <main className="app-main">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  )
}