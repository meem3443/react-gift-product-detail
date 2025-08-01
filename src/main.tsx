import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW === "true") {
    const { client } = await import("./mocks/client");
    //("MSW 목킹 활성화 중...");
    return client.start({
      onUnhandledRequest: "bypass",
    });
  }
  return Promise.resolve();
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
