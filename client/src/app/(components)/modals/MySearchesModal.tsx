"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";

// Collection of saved filter "phrases"
// I'm not sure how to do this yet
export default function MySearchesModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "searches";
  const onClose = () => toggleMenu(false, null);

    return (
    <div
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        <button onClick={onClose}>✕</button>
      </div>
      <h4>My Saved Searches:</h4>
      <form action="" className="modal-form"></form>
    </div>
  );
}
