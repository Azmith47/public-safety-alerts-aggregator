"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";

//Area where the user can subscribe to general alerts
//Any new email matching the alert will trigger a notification via email
//The isOpen prop receives the state variable from page.tsx
//OnClose returns nothing and is defined in page.tsx
export default function SubscribeModal() {
  const { modalOpen  ,toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "subscribe"
  const onClose = () => toggleMenu(false, null)

  return (
    <div
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        <button onClick={onClose}>✕</button>
      </div>
      <h4>Subscribe to alerts:</h4>
      <form action="" className="modal-form">
        <label htmlFor="">Agency</label>
        <select name="" id="">
          <option value="">NSW Rural Fire Service (RFS)</option>
          <option value="">Transport for New South Wales</option>
          <option value="">NSW State Emergency Service (SES)</option>
        </select>
        <label htmlFor="">Region</label>
        <select name="" id="">
          <option value="">Sydney</option>
          <option value="">Hornsby Shire</option>
          <option value="">The Hills Shire</option>
          <option value="">Etc.</option>
        </select>
        <label htmlFor="email">Email</label>
        <textarea></textarea>
      </form>
    </div>
  );
}
