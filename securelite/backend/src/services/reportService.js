const severityWeights = {
  critical: 35,
  high: 20,
  medium: 12,
  low: 6,
  info: 2
};

const typeFriendlyCopy = {
  sqli: {
    title: "Possible form or URL injection risk",
    plainEnglish:
      "Someone may be able to trick your website into accepting unsafe input, which can expose or change important data.",
    recommendation:
      "Have your developer use parameterized database queries, validate form inputs, and block dangerous characters."
  },
  xss: {
    title: "Pages may display unsafe user content",
    plainEnglish:
      "Your website might show harmful code inside the browser, which can put customer accounts or form submissions at risk.",
    recommendation:
      "Escape user-generated content before showing it on the page and enable a strong Content Security Policy."
  },
  csrf: {
    title: "Forms may not be protected against fake requests",
    plainEnglish:
      "A hacker may be able to trick a logged-in user into clicking something that performs an action they did not intend.",
    recommendation:
      "Add CSRF tokens to sensitive forms and verify requests on the server before making changes."
  },
  ssl: {
    title: "SSL/TLS setup needs attention",
    plainEnglish:
      "Visitors may not be getting a fully secure connection, which can reduce trust and expose traffic to interception.",
    recommendation:
      "Install a valid HTTPS certificate, renew it before expiry, and redirect all traffic to HTTPS."
  },
  port: {
    title: "Unnecessary internet-facing service detected",
    plainEnglish:
      "Your website server appears to have extra doors open to the internet. Each open door can create extra risk if it is not needed.",
    recommendation:
      "Close unused ports in your firewall and only keep required services publicly accessible."
  },
  config: {
    title: "Important security settings are missing",
    plainEnglish:
      "Your website may be missing browser protection settings that help block common attacks and reduce exposure.",
    recommendation:
      "Add security headers such as Content-Security-Policy, X-Frame-Options, and Strict-Transport-Security."
  },
  header: {
    title: "Browser security headers should be improved",
    plainEnglish:
      "Visitors' browsers are not getting the full set of safety instructions that help prevent some common attacks.",
    recommendation:
      "Update your server or CDN to return stronger security headers for every page."
  }
};

export const toPlainIssue = ({ scanner = "custom", type, severity, technicalDetails }) => {
  const friendlyCopy = typeFriendlyCopy[type] || {
    title: "Security issue found",
    plainEnglish:
      "The scan found a weakness that should be reviewed so it does not become a bigger problem later.",
    recommendation: "Review this finding with your developer or hosting provider and apply the recommended fix."
  };

  return {
    scanner,
    type,
    severity,
    title: friendlyCopy.title,
    technicalDetails,
    plainEnglish: friendlyCopy.plainEnglish,
    recommendation: friendlyCopy.recommendation
  };
};

export const calculateSecurityScore = (issues = [], ssl = { isValid: true }, openPorts = []) => {
  const issuePenalty = issues.reduce((total, issue) => total + (severityWeights[issue.severity] || 0), 0);
  const sslPenalty = ssl.isValid ? 0 : 18;
  const portPenalty = openPorts.filter((port) => port.status === "open").length * 4;

  return Math.max(0, Math.min(100, 100 - issuePenalty - sslPenalty - portPenalty));
};

export const getRiskLevel = (securityScore) => {
  if (securityScore >= 80) {
    return "Low";
  }

  if (securityScore >= 55) {
    return "Medium";
  }

  return "High";
};

export const buildSummary = ({ securityScore, issues }) => {
  if (!issues.length && securityScore >= 90) {
    return "Good news: we did not find any major security problems in this scan. Keep monitoring your site and stay current with updates.";
  }

  if (securityScore >= 75) {
    return "Your site looks fairly healthy, but there are a few issues worth fixing soon to reduce risk.";
  }

  if (securityScore >= 50) {
    return "Your site has some meaningful security gaps. It is still manageable, but you should plan fixes in the near term.";
  }

  return "Your site has urgent security issues that should be addressed quickly to protect customers and business data.";
};

export const buildFixList = (issues = []) =>
  issues.slice(0, 5).map((issue) => ({
    label: issue.title,
    action: issue.recommendation
  }));
