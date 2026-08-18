import { ModalProps } from "@/app/lib/definitions";

//Area where the user can subscribe to general alerts
//Any new email matching the alert will trigger a notification via email
export default function SubscribeModal({ isOpen, onClose }: ModalProps) {
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
