export function ManagementPage({ title }: { title: string }) {
  return <><div className="eyebrow">WORKSPACE PREVIEW</div><h1>{title}</h1><p className="intro">Your service marketplace, clearly organized.</p>
    <section className="card"><h2>{title === 'Dashboard' ? 'Welcome to your administration workspace' : `${title} management`}</h2>
      <p>This section is ready for implementation. Live records and administrative actions will be connected in a later phase.</p>
      <span className="badge">Setup phase · No live data</span></section></>;
}
