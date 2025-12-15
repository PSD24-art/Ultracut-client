// src/App.jsx
import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ContactPage from "./pages/static/ContactPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginModal from "./components/Login"; // controlled modal
import UserPage from "./pages/User";
import Consumables from "./components/Consumables";
import ShopByBrands from "./components/ShopByBrands";
import BrandPage from "./pages/BrandPage"; // per-brand listing page

import ConsumableItems from "./pages/ConsumableItems";
import BIndividualItem from "./pages/BIndividualItems";
import CIndividualItem from "./pages/CIndividualItem";
import SIndividualItem from "./pages/SIndividualItems";
import Checkout from "./pages/Checkout";
import WhatsAppButton from "./components/WhatsappButton";

function App() {
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
      <div className="min-h-screen flex flex-col">
        <Header
          onLoginClick={() => {
            // when header asks to open login, navigate to /login and show modal
            navigate("/login");
            setShowLogin(true);
          }}
        />

        {/* Only render modal from App (single source of truth) */}
        { showLogin && (
          <LoginModal
            open={showLogin}
            onSuccess={(data) => handleLoginSuccess(data)}
            onClose={handleCloseLogin}
          />
        )}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Cart / Profile / Auth */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/login" element={<Home />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* deep-link handled via effect */}
            {/* Static pages */}
            <Route path="/contact" element={<ContactPage />} />
            {/* Brands */}
            <Route path="/brands" element={<ShopByBrands />} />
            <Route path="/brands/:brand" element={<BrandPage />} />
            <Route path="/brands/:brand/:title" element={<BIndividualItem />} />
            {/* Consumables listing and product detail */}
            <Route path="/consumables" element={<Consumables />} />
            <Route path="/consumables/:slug" element={<ConsumableItems />} />
            <Route
              path="/consumables/:slug/:title"
              element={<CIndividualItem />}
            />
            {/* Item ROute from Search */}
            <Route path="/item/:slug/:title" element={<SIndividualItem />} />
            {/* Fallback route could be added here */}
          </Routes>
        </main>
        <WhatsAppButton />

        <Footer />
      </div>
    </>
  );
}

export default App;
