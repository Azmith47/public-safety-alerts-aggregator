import { Alert } from "@/app/lib/definitions";

export default function DetailedModal({
  isOpen,
  onClose,
  alert,
}: {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
}) {
  //if alert is null render nothing
  if (alert === null) return null;
  return (
    <div
      className={
        isOpen ? "detail-modal-container-visible" : "modal-container-hidden"
      }
    >
      <div className="modal-header">
        <button onClick={onClose}>✕</button>
      </div>
      <h4>{alert.title}</h4>
      <div className="data-grid">
        <article className="labels">
          <p>Type:</p>
          <p>Category:</p>
          <p>Region:</p>
          <p>Suburb:</p>
          <p>Date Published:</p>
        </article>
        <article className="data">
          <p>{alert.type}</p>
          <p>{alert.category}</p>
          <p>{alert.alertLocation.region}</p>
          <p>{alert.alertLocation.suburb}</p>
          <p>{alert.datePublished}</p>
        </article>
      </div>
    </div>
  );
}
