import React  from "react";

export default function SettingsMenu({ onClose }) {
  return (
    <>
      <div className="overlay-blur" onClick={onClose}></div>
      <div className="settings-menu">
        <h2>Settings</h2>
        
      </div>
    </>
  );
}