import { ModalProps } from "@/app/lib/definitions";

//Area where the user can subscribe to general alerts
//Any new email matching the alert will trigger a notification via email
//The isOpen prop receives the state variable from page.tsx
//OnClose returns nothing and is defined in page.tsx
export default function SubscribeModal({ isOpen, onClose }: ModalProps) {
  return (
    <div
      //Visibility of the modal is determined by a ternary that swaps the CSS class
      //The modal is hidden unless isOpen is true
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        {/* Sets isOpen to false, changing the CSS class to modal-container-hidden */}
        <button onClick={onClose}>✕</button>
      </div>
      <h4>Subscribe to alerts:</h4>
      {/* The following form options are placeholders */}
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
