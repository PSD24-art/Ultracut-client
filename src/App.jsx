// src/App.jsx
import React, { lazy, useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Contact from "./components/Contact";
import HeadItemsPage from "./components/SparesByHead";
import SparesByHead from "./components/SparesByHead";
import HeadSelector from "./components/HeadSelector";

const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const UserPage = lazy(() => import("./pages/User"));
const Checkout = lazy(() => import("./pages/Checkout"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
const ConsumableItems = lazy(() => import("./pages/ConsumableItems"));
const IndividualItem = lazy(() => import("./pages/IndividualItems"));

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
      <div className="min-h-screen flex flex-col secondary-bg-color">
        <Header onLoginClick={openLogin} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<UserPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/brands" element={<ShopByBrands />} />
            <Route path="/brands/:brand" element={<BrandPage />} />
            <Route path="/products/:slug" element={<IndividualItem />} />
            <Route path="/consumables" element={<Consumables />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/consumables/:category"
              element={<ConsumableItems />}
            />
          </Routes>
        </main>
        <WhatsAppButton />
        <Footer />
      </div>

      {showLogin && <LoginModal onSuccess={closeLogin} onClose={closeLogin} />}
    </>
  );
}

export default App;
