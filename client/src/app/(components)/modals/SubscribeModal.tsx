"use client";

import { useContext, useState } from "react";
import { MenuContext } from "@/context/MenuContext";
import { API_URL } from "@/app/lib/utils";

//Area where the user can subscribe to general alerts
//Any new email matching the alert will trigger a notification via email
//The isOpen prop receives the state variable from page.tsx
//OnClose returns nothing and is defined in page.tsx
// export default function SubscribeModal() {
//   const { modalOpen  ,toggleMenu } = useContext(MenuContext);
//   const isOpen = modalOpen === "subscribe"
//   const onClose = () => toggleMenu(false, null)

//   return (
//     <div
//       className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
//     >
//       <div className="modal-header">
//         <button onClick={onClose}>✕</button>
//       </div>
//       <h4>Subscribe to alerts:</h4>
//       <form action="" className="modal-form">
//         <label htmlFor="">Agency</label>
//         <select name="" id="">
//           <option value="">NSW Rural Fire Service (RFS)</option>
//           <option value="">Transport for New South Wales</option>
//           <option value="">NSW State Emergency Service (SES)</option>
//         </select>
//         <label htmlFor="">Region</label>
//         <select name="" id="">
//           <option value="">Sydney</option>
//           <option value="">Hornsby Shire</option>
//           <option value="">The Hills Shire</option>
//           <option value="">Etc.</option>
//         </select>
//         <label htmlFor="email">Email</label>
//         <textarea></textarea>
//       </form>
//     </div>
//   );
// }

const CATEGORIES = [
  { id: 1, name: "FIRE" },
  { id: 2, name: "TRAFFIC_INCIDENT" },
  { id: 3, name: "ROAD_HAZARD" },
  { id: 4, name: "FLOOD" },
  { id: 5, name: "STORM" },
  { id: 6, name: "WEATHER" },
  { id: 7, name: "HAZMAT" },
  { id: 8, name: "RESCUE" },
  { id: 9, name: "MEDICAL" },
  { id: 10, name: "PLANNED_BURN" },
  { id: 11, name: "PUBLIC_EVENT" },
  { id: 12, name: "OTHER" },
];

const REGIONS = [
  { id: 1, name: "GREATER_SYDNEY" },
  { id: 2, name: "CENTRAL_COAST" },
  { id: 3, name: "CENTRAL_WEST_ORANA" },
  { id: 4, name: "FAR_WEST" },
  { id: 5, name: "HUNTER" },
  { id: 6, name: "ILLAWARRA_SHOALHAVEN" },
  { id: 7, name: "NEW_ENGLAND_NORTH_WEST" },
  { id: 8, name: "NORTH_COAST" },
  { id: 9, name: "NORTHERN_RIVERS" },
  { id: 10, name: "RIVERINA" },
  { id: 11, name: "MURRAY_RIVERINA_REGION" },
  { id: 12, name: "SOUTH_EAST_TABLELANDS" },
  { id: 13, name: "SOUTH_COAST" },
];

// e.g. "TRAFFIC_INCIDENT" -> "Traffic Incident"
const formatLabel = (s: string) =>
  s
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

type Status = "idle" | "submitting" | "success" | "error";

export default function SubscribeModal() {
  const { modalOpen, toggleMenu } = useContext(MenuContext);
  const isOpen = modalOpen === "subscribe";
  const onClose = () => toggleMenu(false, null);

  const [categoryId, setCategoryId] = useState("");
  const [regionId, setRegionId] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const resetForm = () => {
    setCategoryId("");
    setRegionId("");
    setEmail("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus("error");
      setErrorMsg("Email is required.");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          category_id: categoryId ? Number(categoryId) : null,
          region_id: regionId ? Number(regionId) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      localStorage.setItem("subscriberEmail", email.trim());
      resetForm();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <div
      className={isOpen ? "modal-container-visible" : "modal-container-hidden"}
    >
      <div className="modal-header">
        <button
          onClick={() => {
            resetForm();
            setStatus("idle");
            onClose();
          }}
        >
          ✕
        </button>
      </div>
      <h4>Subscribe to alerts:</h4>

      {status === "success" ? (
        <p>
          Please check your email and click the confirmation link to complete
          your subscription.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="modal-form">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Any category</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {formatLabel(c.name)}
              </option>
            ))}
          </select>

          <label htmlFor="region">Region</label>
          <select
            id="region"
            name="region"
            value={regionId}
            onChange={(e) => setRegionId(e.target.value)}
          >
            <option value="">Any region</option>
            {REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {formatLabel(r.name)}
              </option>
            ))}
          </select>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {status === "error" && <p className="form-error">{errorMsg}</p>}

          <button
            className="apply-btn"
            type="submit"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Loading..." : "Subscribe"}
          </button>
        </form>
      )}
    </div>
  );
}
