// Filter component
// Fields need to be confirmed, everything below is placeholder

export default function FilterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
      {/* The following form options are placeholders */}
      <form action="" className="modal-form">
        {/* Agency */}
        <label htmlFor="">Agency</label>
        <select name="" id="">
          <option value="">NSW Rural Fire Service (RFS)</option>
          <option value="">Transport for New South Wales</option>
          <option value="">NSW State Emergency Service (SES)</option>
        </select>
        {/* Incident Type */}
        <label htmlFor="">Incident Type</label>
        <select name="" id="">
          <option value="">Fire</option>
          <option value="">Flood</option>
          <option value="">Road</option>
          <option value="">Etc.</option>
        </select>
        {/* Region */}
        <label htmlFor="">Region</label>
        <select name="" id="">
          <option value="">Sydney</option>
          <option value="">Hornsby Shire</option>
          <option value="">The Hills Shire</option>
          <option value="">Etc.</option>
        </select>
        {/* Status */}
        <label htmlFor="">Status</label>
        <select name="" id="">
          <option value="">Active</option>
          <option value="">Inactive</option>
        </select>
      </form>
    </div>
  );
}
