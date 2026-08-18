import { Alert } from "@/app/lib/definitions";

//TODO: Display different modals for fire & traffic
//This method DOES NOT scale well
export default function DetailedModal({
  isOpen,
  onClose,
  alert,
}: {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
}) {
  if (alert === null) return null; //if alert is null render nothing
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
      {alert.type === "fire" ? (
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
          <p style={{ color: "red", fontWeight: "bold" }}>
            This is the view for a fire alert
          </p>
        </div>
      ) : (
        <div className="data-grid">
          <article className="labels">
            <p>Type:</p>
            <p>Category:</p>
            <p>Region:</p>
            <p>Suburb:</p>
            <p>Date Published:</p>
            <p>Road:</p>
            <p>Cross Road: </p>
          </article>
          <article className="data">
            <p>{alert.type}</p>
            <p>{alert.category}</p>
            <p>{alert.alertLocation.region}</p>
            <p>{alert.alertLocation.suburb}</p>
            <p>{alert.datePublished}</p>
            <p>bla bla</p>
            <p>bla bla</p>
          </article>
          <p style={{ color: "green", fontWeight: "bold" }}>
            This is the view for any other type of element
          </p>
        </div>
      )}
    </div>
  );
}
