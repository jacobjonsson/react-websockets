import { useEffect, useState } from "react";
import { useWebsocket } from "../websocket";

export function A() {
  const [messages, setMessages] = useState([]);
  const { status, sendMessage, addCallback } = useWebsocket();

  useEffect(() => {
    addCallback((message) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
  }, [addCallback]);

  return (
    <div style={{ border: "1px solid red", padding: "32px" }}>
      <h2>Component A</h2>

      <p>Websocket status: {status}</p>

      <button onClick={() => sendMessage("Sent from A!")}>
        Send message from page
      </button>

      <pre>{JSON.stringify(messages, null, 2)}</pre>
    </div>
  );
}
