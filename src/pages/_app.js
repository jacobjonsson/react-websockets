import { WebsocketProvider } from "../websocket";

function MyApp({ Component, pageProps }) {
  return (
    <WebsocketProvider>
      <Component {...pageProps} />
    </WebsocketProvider>
  );
}

export default MyApp;
