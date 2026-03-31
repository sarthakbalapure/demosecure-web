import { Link } from "react-router-dom";

export default function PricingSection() {
  return (
    <section className="marketing-section">
      <div className="section-heading">
        <span className="eyebrow">Pricing</span>
        <h2>One simple plan for public users</h2>
      </div>
      <div className="pricing-card">
        <div>
          <h3>Starter</h3>
          <p>Built for small businesses that want basic website security visibility.</p>
        </div>
        <div className="price-block">
          <strong>Rs 50</strong>
          <span>per month</span>
        </div>
        <div className="pricing-points">
          <span>10 scans per month</span>
          <span>Plain-English reports</span>
          <span>Email alerts for important findings</span>
          <span>Scan history dashboard</span>
        </div>
        <Link className="primary-button" to="/signup">
          Choose Starter
        </Link>
      </div>
    </section>
  );
}
