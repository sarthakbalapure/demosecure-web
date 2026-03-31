import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection.jsx";
import FeatureGrid from "../components/FeatureGrid.jsx";
import PricingSection from "../components/PricingSection.jsx";

export default function HomePage() {
  return (
    <div className="marketing-page">
      <header className="marketing-header">
        <div className="brand-pill">SecureLite</div>
        <nav className="marketing-nav">
          <Link to="/login">Customer login</Link>
          <Link to="/owner/login">Owner login</Link>
          <Link className="primary-button" to="/signup">
            Get started
          </Link>
        </nav>
      </header>
      <HeroSection />
      <FeatureGrid />
      <PricingSection />
    </div>
  );
}
