import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Cart from "./pages/Cart";
import ConsumablesPage from "./pages/ConsumablesPage";
import BrandsPage from "./pages/BrandPage";
import ContactPage from "./pages/static/ContactPage";
import IndividualItem from "./pages/IndividualItem";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/item" element={<IndividualItem />} />
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
