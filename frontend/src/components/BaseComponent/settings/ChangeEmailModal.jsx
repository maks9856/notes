import { useState } from "react";
import { X } from "lucide-react";
import api from "../../../api";
import { ACCESS_TOKEN } from "../../../constants";

export default function ChangeEmailModal({ email, onClose }) {
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.post("/api/user/password/validate/", {
        password: currentPassword,
      });
    } catch (error) {
      setMessage("Invalid password");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.post("/auth/users/set_email/", { email: newEmail });
      setStep(3);
    } catch (error) {
      setMessage("Email change request failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.post("/auth/users/verify_email_code/", {
        code: verificationCode,
      });
      setMessage("Email successfully updated.");
    } catch (error) {
      setMessage("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dark-overlay" onClick={onClose}></div>
      <div className="change-email-modal">
        <div className="change-email-modal-header">
          <div className="change-email-modal-header-title">
            <h3>Change Email</h3>
            <X className="change-email-modal-close" onClick={onClose} />
          </div>
          <p>Your current email is {email}</p>
        </div>

        {step === 1 && (
          <form
            onSubmit={handlePasswordSubmit}
            className="change-email-modal-form"
          >
            <label htmlFor="currentPassword">Enter current password</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Validating..." : "Continue"}
            </button>
            {message && <p className="change-email-modal-message">{message}</p>}
          </form>
        )}

        {step === 2 && (
          <form
            onSubmit={handleEmailSubmit}
            className="change-email-modal-form"
          >
            <label htmlFor="newEmail">New email address</label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Confirmation Code"}
            </button>
            {message && <p className="change-email-modal-message">{message}</p>}
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handleCodeConfirm}
            className="change-email-modal-form"
          >
            <label htmlFor="code">Enter verification code</label>
            <input
              type="text"
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Confirm"}
            </button>
            {message && <p className="change-email-modal-message">{message}</p>}
          </form>
        )}
      </div>
    </>
  );
}
