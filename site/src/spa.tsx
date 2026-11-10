import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

// index.html carries the launch home page's title and share tags; each report page sets
// "<page> · Where accountability leaks · Jawafdehi Initiative" itself (Layout's DocumentTitle).

// `BASE_URL` is "/" in dev and under the Cloudflare tunnel, and the project
// sub-path on GitHub Pages. Passing it as the router basename keeps every
// in-app link correct in both without a second set of paths.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
