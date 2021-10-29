import { useState, useEffect } from "react";
import { useWebsocket } from "../websocket";

export function B() {
  const [messages, setMessages] = useState([]);
  const { status, sendMessage, addCallback } = useWebsocket();

  useEffect(() => {
    addCallback((message) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
  }, [addCallback]);

  return (
    <div style={{ border: "1px solid red", padding: "32px" }}>
      <h2>Component B</h2>

      <p>Websocket status: {status}</p>

      <button onClick={() => sendMessage("Sent from B!")}>
        Send message from page
      </button>

      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
}
