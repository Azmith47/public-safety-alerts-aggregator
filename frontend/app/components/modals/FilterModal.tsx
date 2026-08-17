import { ModalProps } from "@/app/lib/definitions";
import {
  agencies,
  incidentTypes,
  regions,
  statuses,
} from "@/app/lib/placeholder-data";

// Filter component
// Fields need to be confirmed, everything below is placeholder
export default function FilterModal({ isOpen, onClose }: ModalProps) {
  return (
    //Visibility of the modal is determined by a ternary that swaps the CSS class
    //The modal is hidden unless isOpen is true
    <div
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        {/* Sets isOpen to false, changing the CSS class to modal-container-hidden */}
        <button onClick={onClose}>✕</button>
      </div>
      <h4>Filter alerts:</h4>
      <form action="" className="modal-form">
        <label htmlFor="">Agency</label>
        <select name="" id="">
          {agencies.map((agency) => (
            <option value={agency}>{agency}</option>
          ))}
        </select>
        <label htmlFor="">Incident Type</label>
        <select name="" id="">
          {incidentTypes.map((incident) => (
            <option value={incident}>{incident}</option>
          ))}
        </select>
        <label htmlFor="">Region</label>
        <select name="" id="">
          {regions.map((region) => (
            <option value={region}>{region}</option>
          ))}
        </select>
        <label htmlFor="">Status</label>
        <select name="" id="">
          {statuses.map((status) => (
            <option value={status}>{status}</option>
          ))}
        </select>
        <button className="apply-btn">Filter</button>
      </form>
    </div>
  );
}
