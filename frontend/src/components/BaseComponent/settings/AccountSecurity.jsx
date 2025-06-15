import { useState, useEffect } from "react";
import api from "../../../api";
import ChangeEmailModal from "./changeEmailModal";

export default function AccountSecurity() {
  const [email, setEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("api/user/me");
        setEmail(response.data.email);
      } catch (error) {
        console.error("Помилка при отриманні email користувача:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="account-security">
        <h3>Account security</h3>

        <div className="security-row">
          <div>
            <p className="security-label">Email</p>
            <p className="security-value">{email}</p>
          </div>
          <button onClick={() => setShowEmailModal(true)}>Change email</button>
        </div>

        <div className="security-row">
          <div>
            <p className="security-label">Password</p>
            <p className="security-description">
              Change your password to login to your account.
            </p>
          </div>
          <button>Change password</button>
        </div>

        <div className="security-row">
          <div>
            <p className="security-label">2-step verification</p>
            <p className="security-description">
              Add an additional layer of security to your account during login.
            </p>
          </div>
          <button>Add verification method</button>
        </div>
      </div>

      {showEmailModal && (
        <ChangeEmailModal
          email={email}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </>
  );
}
