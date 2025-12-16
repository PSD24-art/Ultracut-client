// src/App.jsx
import React, { lazy, useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const UserPage = lazy(() => import("./pages/User"));
const Checkout = lazy(() => import("./pages/Checkout"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
const ConsumableItems = lazy(() => import("./pages/ConsumableItems"));
const BIndividualItem = lazy(() => import("./pages/BIndividualItems"));
const CIndividualItem = lazy(() => import("./pages/CIndividualItem"));
const SIndividualItem = lazy(() => import("./pages/SIndividualItems"));
const ContactPage = lazy(() => import("./pages/static/ContactPage"));

const LoginModal = lazy(() => import("./components/Login"));
const Consumables = lazy(() => import("./components/Consumables"));
const ShopByBrands = lazy(() => import("./components/ShopByBrands"));
const WhatsAppButton = lazy(() => import("./components/WhatsappButton"));

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const showLogin = location.state?.showLogin === true;

  const openLogin = () => {
    navigate(location.pathname, {
      state: { showLogin: true },
    });
  };

  const closeLogin = () => {
    navigate(location.pathname, {
      state: {},
      replace: true,
    });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header onLoginClick={openLogin} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/brands" element={<ShopByBrands />} />
            <Route path="/brands/:brand" element={<BrandPage />} />
            <Route path="/brands/:brand/:title" element={<BIndividualItem />} />
            <Route path="/consumables" element={<Consumables />} />
            <Route path="/consumables/:slug" element={<ConsumableItems />} />
            <Route
              path="/consumables/:slug/:title"
              element={<CIndividualItem />}
            />
            <Route path="/item/:slug/:title" element={<SIndividualItem />} />
          </Routes>
        </main>

        <WhatsAppButton />
        <Footer />
      </div>

      {/* ✅ LOGIN MODAL OVERLAY */}
      {showLogin && <LoginModal onSuccess={closeLogin} onClose={closeLogin} />}
    </>
  );
}

export default App;
