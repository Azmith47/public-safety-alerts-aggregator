// Collection of alerts
// Saved when the user ticks the 'subscribe to this alert' checkbox?
// I'm not sure how to do this yet

export default function MyAlertsModal({
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
      <h4>Alert Subscriptions</h4>
      {/* The following form options are placeholders */}
      <form action="" className="modal-form"></form>
    </div>
  );
}
