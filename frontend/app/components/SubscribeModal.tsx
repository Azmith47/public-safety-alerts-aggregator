export default function SubscribeModal({
  isOpen, //The isOpen prop receives the state variable from page.tsx
  onClose, //OnClose returns nothing and is defined in page.tsx
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
        <label htmlFor="">Service</label>
        <select name="" id="">
          <option value="">RFS</option>
          <option value="">TFNSW</option>
          <option value="">SES</option>
        </select>
        <label htmlFor="">Location</label>
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
