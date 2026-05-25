export default function AlertMenuModal({
  alertsMenuOpen,
}: {
  alertsMenuOpen: boolean;
}) {
  return (
    <div
      className={
        alertsMenuOpen ? "modal-container-visible" : "modal-container-hidden"
      }
    >
      <form action="" className="modal-form">
        <label htmlFor="">Service</label>
        <select name="" id="">
          <option value="">RFS</option>
          <option value="">BOM</option>
          <option value="">SES</option>
        </select>
        <label htmlFor="">Location</label>
        <select name="" id="">
          <option value="">option1</option>
          <option value="">option2</option>
          <option value="">option3</option>
        </select>
        <label htmlFor="email">Email</label>
        <textarea></textarea>
      </form>
    </div>
  );
}
