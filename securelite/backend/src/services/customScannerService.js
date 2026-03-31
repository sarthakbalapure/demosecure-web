import axios from "axios";
import tls from "tls";

const defaultHeaders = [
  { key: "content-security-policy", title: "Missing Content Security Policy", severity: "medium" },
  { key: "x-frame-options", title: "Missing frame protection", severity: "medium" },
  { key: "strict-transport-security", title: "Missing HSTS header", severity: "low" },
  { key: "x-content-type-options", title: "Missing MIME type protection", severity: "low" }
];

export const runSslCheck = async ({ hostname }) =>
  new Promise((resolve) => {
    const socket = tls.connect(
      {
        host: hostname,
        port: 443,
        servername: hostname,
        rejectUnauthorized: false
      },
      () => {
        const certificate = socket.getPeerCertificate();
        socket.end();

        resolve({
          isValid: Boolean(certificate.valid_to),
          issuer: certificate.issuer?.O || certificate.issuer?.CN || "Unknown issuer",
          validTo: certificate.valid_to || "",
          message: certificate.valid_to
            ? "HTTPS is enabled with a detected certificate."
            : "A valid HTTPS certificate was not detected.",
          issues: certificate.valid_to
            ? []
            : [
                {
                  scanner: "ssl-custom",
                  type: "ssl",
                  severity: "high",
                  technicalDetails: "No valid TLS certificate details were returned from port 443."
                }
              ]
        });
      }
    );

    socket.on("error", () =>
      resolve({
        isValid: false,
        issuer: "",
        validTo: "",
        message: "We could not verify a valid HTTPS certificate for this website.",
        issues: [
          {
            scanner: "ssl-custom",
            type: "ssl",
            severity: "high",
            technicalDetails: "TLS handshake failed or no certificate was available on port 443."
          }
        ]
      })
    );
  });

export const runConfigCheck = async ({ targetUrl }) => {
  try {
    const response = await axios.get(targetUrl, {
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: () => true
    });

    const headers = response.headers || {};
    const issues = defaultHeaders
      .filter((header) => !headers[header.key])
      .map((header) => ({
        scanner: "config-custom",
        type: headers[header.key] ? "config" : "header",
        severity: header.severity,
        technicalDetails: `${header.title}: the ${header.key} header was not present in the response.`
      }));

    return {
      headers,
      issues
    };
  } catch (_error) {
    return {
      headers: {},
      issues: [
        {
          scanner: "config-custom",
          type: "config",
          severity: "medium",
          technicalDetails: "We could not retrieve the page headers to complete the configuration scan."
        }
      ]
    };
  }
};
