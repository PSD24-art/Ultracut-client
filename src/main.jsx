import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ProductsProvider } from "./contexts/ProductContexts.jsx";
import { ConsumablesProvider } from "./contexts/ConsumableContext.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ProductsProvider>
        <AuthProvider>
          <ConsumablesProvider>
            <App />
          </ConsumablesProvider>
        </AuthProvider>
      </ProductsProvider>
    </Router>
  </StrictMode>
);
