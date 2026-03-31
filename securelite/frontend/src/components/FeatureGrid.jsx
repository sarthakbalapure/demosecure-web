export default function FeatureGrid() {
  const features = [
    {
      title: "One-click scans",
      text: "Paste your URL and run a security check without touching server settings."
    },
    {
      title: "Plain-English reports",
      text: "We translate technical findings into simple business-friendly explanations."
    },
    {
      title: "Beginner-friendly dashboard",
      text: "Track scan history, monitor SSL health, and see what should be fixed next."
    },
    {
      title: "Email alerts",
      text: "Get notified when higher-risk issues appear so nothing important gets missed."
    }
  ];

  return (
    <section className="marketing-section">
      <div className="section-heading">
        <span className="eyebrow">Why SecureLite</span>
        <h2>Made for owners, not security teams</h2>
      </div>
      <div className="feature-grid">
        {features.map((feature) => (
          <article className="panel" key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
