import { API } from "../lib/api";

export default function SOSButton() {
  const fire = async () => {
    try {
      const loc = "Unknown";
      const { data } = await API.post("/emergency/sos", { location: loc, message: "Help needed" });
      alert("SOS sent: " + data.id);
    } catch (e) {
      alert("Failed to send SOS");
    }
  };
  return <button className="btn btn-error btn-lg" onClick={fire}>One‑click SOS</button>;
}
