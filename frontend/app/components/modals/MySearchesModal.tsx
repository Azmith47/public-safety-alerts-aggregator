import { ModalProps } from "@/app/lib/definitions";

//TODO: Save active filters (filter tabs) as a reusable pattern
//Saved to 'My searches'
//User clicks the entry and the filters automatically apply
//Not sure how to do this yet
export default function MySearchesModal({ isOpen, onClose }: ModalProps) {
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
