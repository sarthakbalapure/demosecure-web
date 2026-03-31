import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="brand-pill">SecureLite</div>
        <h1>Website security checks for small businesses that need simple answers</h1>
        <p>
          Scan your site in one click, understand risks in plain English, and stay on top of security without
          needing a full-time expert.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/signup">
            Start for Rs 50/month
          </Link>
          <Link className="secondary-button" to="/login">
            Customer login
          </Link>
        </div>
      </div>
      <div className="hero-panel">
        <div className="panel stat-stack">
          <div className="mini-metric">
            <span>Starter plan</span>
            <strong>Rs 50 / month</strong>
          </div>
          <div className="mini-metric">
            <span>Included scans</span>
            <strong>10 scans each month</strong>
          </div>
          <div className="mini-metric">
            <span>Best for</span>
            <strong>Shopify, WordPress, and brochure websites</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
