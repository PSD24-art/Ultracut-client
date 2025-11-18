import Header from "../components/Header";
import Banner from "../components/Banner";
import ShopByBrands from "../components/ShopByBrands";
import Footer from "../components/Footer";
import Consumables from "../components/Consumables";

function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <Header />
      {/* Banner */}
      <Banner />
      {/* Shop by Brands */}
      <ShopByBrands />
      {/* Example consumables / other sections */}
      <Consumables />
      <Footer />
    </div>
  );
}

export default Home;
