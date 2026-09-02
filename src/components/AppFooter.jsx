import { useState } from "react";
import { ShieldCheck, X } from "lucide-react";

function AppFooter() {
  const [modalContent, setModalContent] = useState(null); // 'privacy' | 'terms' | 'security' | null

  const openModal = (type, e) => {
    e.preventDefault();
    setModalContent(type);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <>
      <footer className="global-app-footer">
        <div className="footer-inner">
          {/* Left: Copyright & Tagline */}
          <div className="footer-left">
            <span className="footer-copyright">
              © {new Date().getFullYear()} <strong>Expense Tracker</strong>. All rights reserved.
            </span>
            <span className="footer-divider">•</span>
            <span className="footer-craft">
              Built with precision &amp; modern web standards.
            </span>
          </div>

          {/* Right: Essential Legal & Info Links */}
          <div className="footer-right">
            <a href="#privacy" className="footer-link" onClick={(e) => openModal("privacy", e)}>
              Privacy Policy
            </a>
            <a href="#terms" className="footer-link" onClick={(e) => openModal("terms", e)}>
              Terms of Service
            </a>
            <a href="#security" className="footer-link" onClick={(e) => openModal("security", e)}>
              <ShieldCheck size={14} className="footer-link-icon" />
              Security
            </a>
          </div>
        </div>
      </footer>

      {/* Interactive Information Modal for Footer Links */}
      {modalContent && (
        <div className="footer-modal-overlay" onClick={closeModal}>
          <div
            className="footer-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="footer-modal-header">
              <h3>
                {modalContent === "privacy" && "Privacy & Data Protection"}
                {modalContent === "terms" && "Terms of Service"}
                {modalContent === "security" && "Security & Architecture"}
              </h3>
              <button
                type="button"
                className="footer-modal-close"
                onClick={closeModal}
                title="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="footer-modal-body">
              {modalContent === "privacy" && (
                <>
                  <p>
                    Expense Tracker protects your account data with user-specific isolation and token-based authentication.
                  </p>
                  <ul>
                    <li><strong>No Third-Party Sharing:</strong> We do not sell or share your transactional data.</li>
                    <li><strong>Token Authentication:</strong> Authenticated sessions use secure bearer tokens for API requests.</li>
                    <li><strong>Account Isolation:</strong> Expenses are strictly mapped and isolated to your authenticated user account.</li>
                  </ul>
                </>
              )}

              {modalContent === "terms" && (
                <>
                  <p>
                    By using Expense Tracker, you agree to responsible usage and management of your spending logs.
                  </p>
                  <ul>
                    <li><strong>Personal Use:</strong> Provisioned for individual expense tracking and spending analytics.</li>
                    <li><strong>Data Accuracy:</strong> Metrics and charts are computed directly from entries you record.</li>
                    <li><strong>Account Security:</strong> You are responsible for safeguarding your login credentials.</li>
                  </ul>
                </>
              )}

              {modalContent === "security" && (
                <>
                  <p>
                    Expense Tracker is built on a clean full-stack architecture with standard REST API security practices.
                  </p>
                  <ul>
                    <li><strong>Token-Based Auth:</strong> Session authorization is verified via Django REST Framework token authentication.</li>
                    <li><strong>User-Specific Queries:</strong> Database queries are scoped strictly to the authenticated user ID.</li>
                    <li><strong>Secure Communication:</strong> Client and server communicate over encrypted HTTP endpoints.</li>
                  </ul>
                </>
              )}
            </div>

            <div className="footer-modal-footer">
              <button type="button" className="btn-modal-done" onClick={closeModal}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppFooter;
