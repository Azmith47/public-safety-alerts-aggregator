"use client";

import { useContext } from "react";
import { MenuContext } from "@/context/MenuContext";
import { AlertsContext } from "@/context/AlertsContext";

export default function PageOverlay() {
  const { menuOpen, modalOpen, toggleMenu } = useContext(MenuContext);
  const { updateSelectedAlert, updateSelectedMarker } =
    useContext(AlertsContext);

  if (menuOpen || modalOpen !== null) {
    return (
      <div
        className="page-overlay"
        onClick={() => {
          updateSelectedAlert(null);
          updateSelectedMarker(null);
          toggleMenu(false, null);
        }}
      />
    );
  }

  return null;
}