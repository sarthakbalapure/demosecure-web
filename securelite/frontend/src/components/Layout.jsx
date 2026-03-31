export default function Layout({ user, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <div className="brand-pill">SecureLite</div>
          <h2>Website Security Made Simple</h2>
          <p>Run scans, understand your risk, and share fixes with your developer.</p>
        </div>
        <div className="sidebar-user">
          <strong>{user?.name}</strong>
          <span>{user?.companyName || user?.email}</span>
          <button className="secondary-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
