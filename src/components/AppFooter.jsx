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
          <div className="footer-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="footer-modal-header">
              <h3>
                {modalContent === "privacy" && "Privacy & Data Protection"}
                {modalContent === "terms" && "Terms of Service"}
                {modalContent === "security" && "Security & Infrastructure"}
              </h3>
              <button type="button" className="footer-modal-close" onClick={closeModal}>
                <X size={18} />
              </button>
            </div>

            <div className="footer-modal-body">
              {modalContent === "privacy" && (
                <>
                  <p>
                    Your privacy is our utmost priority. Expense Tracker enforces a strict zero-knowledge data policy for personal financial figures.
                  </p>
                  <ul>
                    <li><strong>No Third-Party Tracking:</strong> We never sell, monetize, or share your transactional data.</li>
                    <li><strong>Encrypted Tokens:</strong> All authentication sessions use secure, encrypted bearer tokens.</li>
                    <li><strong>Data Portability:</strong> You can export or delete your full expense history at any time.</li>
                  </ul>
                </>
              )}

              {modalContent === "terms" && (
                <>
                  <p>
                    By using Expense Tracker, you agree to responsible financial logging and adherence to our service guidelines.
                  </p>
                  <ul>
                    <li><strong>Personal Use:</strong> Free tier is provisioned for individual financial management and budgeting.</li>
                    <li><strong>Data Accuracy:</strong> Figures displayed in analytics are generated from user-provided entries.</li>
                    <li><strong>Availability:</strong> We strive for 99.9% uptime with high-performance edge caching.</li>
                  </ul>
                </>
              )}

              {modalContent === "security" && (
                <>
                  <p>
                    Expense Tracker implements multi-layered security controls to keep your accounts protected.
                  </p>
                  <ul>
                    <li><strong>TLS 1.3 / SSL Encryption:</strong> All client-to-server traffic is end-to-end encrypted.</li>
                    <li><strong>Session Protection:</strong> Automatic token timeout and authorization sanitization.</li>
                    <li><strong>Isolated Sandboxing:</strong> Clean separation between client rendering and backend APIs.</li>
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
