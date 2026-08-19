import { Alert } from "@/app/lib/definitions";

//TODO: Display different modals for fire & traffic
//Current method DOES NOT scale well
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
        <>
          <article className="modal-grid">
            <span className="modal-label">Type:</span>
            <span>{alert.type}</span>
            <span className="modal-label">Category:</span>
            <span>{alert.category}</span>
            <span className="modal-label">Region:</span>
            <span>{alert.alertLocation.region}</span>
            <span className="modal-label">Suburb:</span>
            <span>{alert.alertLocation.suburb}</span>
            <span className="modal-label">Date Published:</span>
            <span>{alert.datePublished}</span>
          </article>
          <p
            style={{
              color: "red",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "3rem",
            }}
          >
            This is the view for fire alert
          </p>
        </>
      ) : (
        <>
          <article className="modal-grid">
            <span className="modal-label">Type:</span>
            <span>{alert.type}</span>
            <span className="modal-label">Category:</span>
            <span>{alert.category}</span>
            <span className="modal-label">Region:</span>
            <span>{alert.alertLocation.region}</span>
            <span className="modal-label">Suburb:</span>
            <span>{alert.alertLocation.suburb}</span>
            <span className="modal-label">Date Published:</span>
            <span>{alert.datePublished}</span>
          </article>
          <p
            style={{
              color: "green",
              fontWeight: "bold",
              textAlign: "center",
              marginTop: "3rem",
            }}
          >
            This is the view for any other type of element
          </p>
        </>
      )}
    </div>
  );
}
