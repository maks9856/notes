import { useState } from "react";
import { X } from "lucide-react";
import api from "../../../api";

export default function ChangePasswordModal({ onClose }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const handlePasswordCheck = async (e) => {};
  return (
    <>
      <div className="dark-overlay" onClick={onClose}></div>
      <div className="change-modal">
        <div className="change-modal-header">
          <div className="change-modal-header-title">
            <h3>Change Password</h3>
            <X className="change-modal-close" onClick={onClose} />
          </div>
        </div>
        <form
          autoComplete="off"
          onSubmit={handlePasswordCheck}
          className="change-modal-form"
        >
          <label htmlFor="currentPassword">Enter current password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
            }}
            required
          ></input>
          <label htmlFor="newPassword">Enter new password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
            autoComplete="new-password"
            required
          ></input>
          <label htmlFor="confirmNewPassword">Enter confirm new password</label>
          <input
            type="password"
            id="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => {
              setconfirmNewPassword(e.target.value);
            }}
            autoComplete="new-password"
            required
          ></input>
          <button type="submit">Change Password</button>
        </form>
      </div>
    </>
  );
}
