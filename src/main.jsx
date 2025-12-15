import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ProductsProvider } from "./contexts/ProductContexts.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <ProductsProvider>
        <AuthProvider>
         
            <App />
         
        </AuthProvider>
      </ProductsProvider>
    </Router>
  </StrictMode>
);
