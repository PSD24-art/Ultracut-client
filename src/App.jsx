// src/App.jsx
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Cart from "./pages/Cart";
import ConsumablesPage from "./pages/ConsumablesPage";
import BrandsPage from "./pages/BrandPage";
import ContactPage from "./pages/static/ContactPage";
import IndividualItem from "./pages/IndividualItem";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/Login"; // controlled modal
import UserPage from "./pages/User";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // If user navigates to /login, open the modal (deep-link support).
  useEffect(() => {
    if (location.pathname === "/login") {
      setShowLogin(true);
    }
  }, [location.pathname]);

  const handleLoginSuccess = (data) => {
    console.log("Logged in: ", data);
    setShowLogin(false);
    // after login, clear /login route if present
    if (location.pathname === "/login") navigate("/", { replace: true });
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
    // if user closed modal and URL is /login, navigate away
    if (location.pathname === "/login") navigate("/", { replace: true });
  };

  return (
    <>
      <div>
        <Header
          onLoginClick={() => {
            // when header asks to open login, navigate to /login and show modal
            navigate("/login");
            setShowLogin(true);
          }}
        />

        {/* Only render modal from App (single source of truth) */}
        {!loading && showLogin && (
          <LoginModal
            open={showLogin}
            onSuccess={(data) => handleLoginSuccess(data)}
            onClose={handleCloseLogin}
          />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/item" element={<IndividualItem />} />

          {/* /login route is still valid as a deep-link; modal opening is handled via effect above.
              We render nothing special here to avoid duplication. */}
          <Route path="/login" element={<Home />} />

          <Route path="/profile" element={<UserPage />} />

          {/* other routes */}
          <Route
            path="/consumables/:category/:productSlug"
            element={<IndividualItem />}
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/consumables" element={<ConsumablesPage />} />
          <Route path="/consumables/:slug" element={<Items />} />
        </Routes>

        <Footer />
      </div>
    </>
  );
}

export default App;
