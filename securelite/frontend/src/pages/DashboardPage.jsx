import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/client.js";
import Layout from "../components/Layout.jsx";
import ScanForm from "../components/ScanForm.jsx";
import ScoreCard from "../components/ScoreCard.jsx";
import IssueList from "../components/IssueList.jsx";
import ScanHistoryTable from "../components/ScanHistoryTable.jsx";
import InfrastructureCard from "../components/InfrastructureCard.jsx";
import PlanCard from "../components/PlanCard.jsx";
import AdminOverview from "../components/AdminOverview.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [scans, setScans] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (user?.role === "owner") {
        const response = await api.get("/admin/overview");
        setOverview(response.data.data);
      } else {
        const response = await api.get("/scans");
        setScans(response.data.data);
      }
    } catch (apiError) {
      setError(apiError.response?.data?.message || "We could not load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const handleScan = async (payload) => {
    try {
      setSubmitLoading(true);
      setError("");
      const endpoint = payload.scanType === "full" ? "/scans" : `/scans/${payload.scanType}`;
      const response = await api.post(endpoint, { targetUrl: payload.targetUrl });
      const newScan = response.data.data;
      setScans((current) => [newScan, ...current]);
      navigate(`/results/${newScan._id}`);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "We could not run that scan.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const latestScan = scans[0];
  const isOwner = user?.role === "owner";

  return (
    <Layout user={user} onLogout={handleLogout}>
      <motion.div className="page-header" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <span className="eyebrow">{isOwner ? "Owner dashboard" : "Dashboard"}</span>
          <h1>{isOwner ? "Monitor the SecureLite platform" : "Your website security, simplified"}</h1>
          <p>
            {isOwner
              ? "Review customer growth, recent activity, and overall product usage."
              : "Run scans, track past results, and understand exactly what to fix next."}
          </p>
        </div>
      </motion.div>

      {isOwner ? null : <ScanForm onSubmit={handleScan} loading={submitLoading} />}
      {error ? <div className="banner-error">{error}</div> : null}

      {isOwner ? null : (
        <div className="dashboard-grid">
          <ScoreCard latestScan={latestScan} />
          <InfrastructureCard latestScan={latestScan} />
        </div>
      )}

      {loading ? (
        <div className="panel">Loading dashboard...</div>
      ) : (
        <>
          <PlanCard user={user} />
          {isOwner ? (
            <AdminOverview overview={overview} />
          ) : (
            <>
              <IssueList issues={latestScan?.issues || []} fixes={latestScan?.fixes || []} />
              <ScanHistoryTable scans={scans} />
            </>
          )}
        </>
      )}
    </Layout>
  );
}
