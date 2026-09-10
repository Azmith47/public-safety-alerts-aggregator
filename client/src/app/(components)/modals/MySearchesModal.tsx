"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";
import { FilterContext } from "@/context/FilterContext";

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
      <h4>Recent Searches:</h4>
      <form action="" className="modal-form"></form>
    </div>
  );
}
