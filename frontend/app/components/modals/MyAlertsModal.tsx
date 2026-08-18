import { ModalProps } from "@/app/lib/definitions";

//TODO: Saved alert when user ticks checkbox (detailed modal view)
//No idea how to do this yet
export default function MyAlertsModal({ isOpen, onClose }: ModalProps) {
  return (
    <div
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        <button onClick={onClose}>✕</button>
      </div>
      <h4>Alert Subscriptions</h4>
      <form action="" className="modal-form"></form>
    </div>
  );
}
