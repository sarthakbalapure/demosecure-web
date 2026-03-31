import { motion } from "framer-motion";

const severityLabel = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  info: "Info"
};

export default function IssueList({ issues = [], fixes = [] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3>Latest findings</h3>
        <span>{issues.length} issue(s)</span>
      </div>
      {issues.length === 0 ? (
        <p className="empty-state">No issues found in the latest scan.</p>
      ) : (
        <div className="issue-list">
          {issues.map((issue, index) => (
            <motion.article
              key={`${issue.title}-${index}`}
              className="issue-card"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, boxShadow: "0 18px 48px rgba(20, 33, 61, 0.12)" }}
            >
              <div className={`severity-badge ${issue.severity}`}>{severityLabel[issue.severity]}</div>
              <h4>{issue.title}</h4>
              <p>{issue.plainEnglish}</p>
              <div className="issue-note">
                <strong>Recommended next step:</strong> {issue.recommendation}
              </div>
              <button className="secondary-button issue-fix-button" type="button">
                Fix this
              </button>
            </motion.article>
          ))}
        </div>
      )}
      {fixes.length ? (
        <div className="fix-list">
          {fixes.map((fix, index) => (
            <div className="fix-row" key={`${fix.label}-${index}`}>
              <strong>{fix.label}</strong>
              <span>{fix.action}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
