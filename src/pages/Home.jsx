import Header from "../components/Header";
import Banner from "../components/Banner";
import ShopByBrands from "../components/ShopByBrands";
import Consumables from "../components/Consumables";
import ShopByHead from "../components/ShopByHead";

function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      {/* Banner */}
      <Banner />
      {/* Shop by Brands */}
      <ShopByBrands />
      {/* Example consumables / other sections */}
      <Consumables />
      <ShopByHead />
    </div>
  );
}

export default Home;
