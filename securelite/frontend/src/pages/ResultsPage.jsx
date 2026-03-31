import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/client.js";
import Layout from "../components/Layout.jsx";
import ResultsSummary from "../components/ResultsSummary.jsx";
import IssueList from "../components/IssueList.jsx";
import LoadingAnimation from "../components/LoadingAnimation.jsx";
import InfrastructureCard from "../components/InfrastructureCard.jsx";
import PlanCard from "../components/PlanCard.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function ResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScan = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/scans/${id}`);
        setScan(response.data.data);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "We could not load this report.");
      } finally {
        setLoading(false);
      }
    };

    fetchScan();
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout user={user} onLogout={handleLogout}>
      <motion.div className="content-stack" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="page-header">
          <div>
            <span className="eyebrow">Results page</span>
            <h1>Security report in plain English</h1>
            <p>See what was found, why it matters, and what to fix next.</p>
          </div>
        </div>

        {loading ? <LoadingAnimation label="Loading your report..." /> : null}
        {error ? <div className="banner-error">{error}</div> : null}

        {scan ? (
          <>
            <ResultsSummary scan={scan} />
            <PlanCard user={user} />
            <InfrastructureCard latestScan={scan} />
            <IssueList issues={scan.issues || []} fixes={scan.fixes || []} />
          </>
        ) : null}
      </motion.div>
    </Layout>
  );
}
