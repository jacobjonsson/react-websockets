import { A } from "../components/A";
import { B } from "../components/B";
import { useWebsocket } from "../websocket";

export default function Home() {
  const { sendMessage } = useWebsocket();

  return (
    <div style={{ border: "1px solid red", padding: "32px" }}>
      <h1>Home Page</h1>

      <button onClick={() => sendMessage("Sent from page!")}>
        Send message from page
      </button>

      <A />
      <B />
    </div>
  );
}
